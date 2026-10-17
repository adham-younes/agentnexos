/** Session-only context. Exact user statements are not verified organizational facts. */
export const contextLimits = Object.freeze({ messages: 12, characters: 12000, messageCharacters: 4000 });
export type ContextMessage = { role: "user" | "assistant"; parts: { type: "text"; text: string }[] };
export function projectConversation(messages: { role: string; parts: { type: string; text?: string }[] }[]): ContextMessage[] {
  const candidates = messages.flatMap((message, index) => {
    if (message.role !== "user" && message.role !== "assistant") return [];
    const text = message.parts.filter(part => part.type === "text").map(part => part.text ?? "").join("\n");
    // Keep whole turns; an oversized old answer must not make the next API call invalid.
    if (!text.trim() || text.length > contextLimits.messageCharacters) return [];
    return [{ index, role: message.role as ContextMessage["role"], text }];
  });
  const users = candidates.filter(message => message.role === "user");
  const lastUser = users.at(-1);
  if (!lastUser) return [];
  const latestAssistant = [...candidates].reverse().find(message => message.role === "assistant" && message.index < lastUser.index);
  // Preserve the original request and newer user corrections before older model prose.
  const priority = [lastUser, users[0], latestAssistant, ...users.slice().reverse(), ...candidates.slice().reverse()];
  const selected = new Map<number, (typeof candidates)[number]>();
  let length = 0;
  for (const message of priority) {
    if (!message || selected.has(message.index) || message.index > lastUser.index) continue;
    const size = message.role.length + 2 + message.text.length + (selected.size ? 2 : 0);
    if (selected.size >= contextLimits.messages || length + size > contextLimits.characters) continue;
    selected.set(message.index, message); length += size;
  }
  return [...selected.values()].sort((a, b) => a.index - b.index).map(message => ({ role: message.role, parts: [{ type: "text", text: message.text }] }));
}
export type SessionTaskState = {
  latestUserTurn: number; priorUserTurns: number[]; correctionTurns: number[];
  userStatementsAreUnverified: true; assistantTurnsAreProposals: true;
};
/** References existing bounded turns rather than adding a duplicate memory payload. */
export function sessionTaskState(messages: ContextMessage[]): SessionTaskState {
  const users = messages.flatMap((message, index) => message.role === "user" ? [{ turn: index + 1, text: message.parts.map(part => part.text).join("\n") }] : []);
  return { latestUserTurn: users.at(-1)?.turn ?? 0, priorUserTurns: users.slice(0, -1).map(item => item.turn),
    correctionTurns: users.filter(item => /actually|correction|instead|not that|i meant|revise|change|تصحيح|اقصد|قصدي|بدل|عد.?ل|مش كده|لا،/i.test(item.text)).map(item => item.turn),
    userStatementsAreUnverified: true, assistantTurnsAreProposals: true };
}
export function conversationText(messages: ContextMessage[]) {
  return messages.map(message => `${message.role}: ${message.parts.map(part => part.text).join("\n")}`).join("\n\n");
}
