/** Context projection only; it is neither durable state nor long-term memory. */
export const contextLimits = Object.freeze({ messages: 12, characters: 12000, messageCharacters: 4000 });
export type ContextMessage = { role: "user" | "assistant"; parts: { type: "text"; text: string }[] };
export function projectConversation(messages: { role: string; parts: { type: string; text?: string }[] }[]): ContextMessage[] {
  const selected: ContextMessage[] = [];
  let length = 0;
  for (const message of [...messages].reverse()) {
    if (message.role !== "user" && message.role !== "assistant") continue;
    const text = message.parts.filter(part => part.type === "text").map(part => part.text ?? "").join("\n");
    if (!text.trim()) continue;
    const size = message.role.length + 2 + text.length + (selected.length ? 2 : 0);
    if (selected.length >= contextLimits.messages || length + size > contextLimits.characters) break;
    // Do not truncate a message into a different meaning.
    selected.unshift({ role: message.role, parts: [{ type: "text", text }] });
    length += size;
  }
  // Avoid presenting an orphaned response as the first context item.
  while (selected[0]?.role === "assistant") selected.shift();
  return selected;
}
export function conversationText(messages: ContextMessage[]) {
  return messages.map(message => `${message.role}: ${message.parts.map(part => part.text).join("\n")}`).join("\n\n");
}
