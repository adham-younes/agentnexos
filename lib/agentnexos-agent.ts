import { ToolLoopAgent, tool, stepCountIs, type InferAgentUIMessage } from "ai";
import { z } from "zod";

const processContract = tool({
  description: "Structure an enterprise process into a bounded automation contract. This is analysis only and performs no external action.",
  inputSchema: z.object({ outcome:z.string(), actors:z.array(z.string()), inputs:z.array(z.string()), systems:z.array(z.string()), steps:z.array(z.string()).min(2).max(8), risks:z.array(z.string()), approvalGates:z.array(z.string()), metrics:z.array(z.string()) }),
  execute: async input => ({ kind:"automation_blueprint", execution:"analysis_only", ...input }),
});

export const agentnexosAgent = new ToolLoopAgent({
  model: "openai/gpt-6-luna",
  instructions: `You are Agentnexos, an enterprise process architect for organizations in the Middle East. Reply in the user's language. Clarify the business outcome before technology. Use the processContract tool once enough information exists. Distinguish facts from assumptions. Never claim an integration, certification, customer, or capability that is not provided. Never execute external actions. End with: outcome, current inputs, proposed state flow, systems/tools, human approval gates, risks, measurable KPIs, and the next three validation questions. Keep Arabic precise and professional.`,
  tools: { processContract },
  stopWhen: stepCountIs(4),
});
export type AgentnexosMessage = InferAgentUIMessage<typeof agentnexosAgent>;
