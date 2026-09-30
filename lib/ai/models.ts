import { createOpenAI } from "@ai-sdk/openai";

/**
 * Multi-Agent Model Configuration for Agentnexos
 *
 * Models configured per MASTER-PLAN-AND-HANDOFF-2026-09-29:
 * 1. Process Analyst: qwen/qwen3.8-27b (GROQ_API_KEY)
 * 2. Tool Orchestrator: qwen/qwen3.8-27b (GROQ_API_KEY1)
 * 3. Verifier Supervisor: openai/gpt-oss-120b (GROQ_API_KEY2)
 */

const GROQ_BASE_URL = "https://api.groq.com/openai/v1";

export function getAnalystModel() {
  const apiKey =
    process.env.GROQ_API_KEY ||
    process.env.GROQ_API_KEY1 ||
    process.env.GROQ_API_KEY2;

  if (!apiKey) return null;

  const groq = createOpenAI({
    baseURL: GROQ_BASE_URL,
    apiKey,
  });

  return groq.chat("qwen/qwen3.8-27b");
}

export function getOrchestratorModel() {
  const apiKey =
    process.env.GROQ_API_KEY1 ||
    process.env.GROQ_API_KEY ||
    process.env.GROQ_API_KEY2;

  if (!apiKey) return null;

  const groq = createOpenAI({
    baseURL: GROQ_BASE_URL,
    apiKey,
  });

  return groq.chat("qwen/qwen3.8-27b");
}

export function getVerifierModel() {
  const apiKey =
    process.env.GROQ_API_KEY2 ||
    process.env.GROQ_API_KEY ||
    process.env.GROQ_API_KEY1;

  if (!apiKey) return null;

  const groq = createOpenAI({
    baseURL: GROQ_BASE_URL,
    apiKey,
  });

  return groq.chat("openai/gpt-oss-120b");
}

export const MODEL_LIMITS = {
  qwen: {
    maxTokensCap: 16384,
    defaultBudget: 2048,
    temperature: 0.2,
  },
  gptOss: {
    maxTokensCap: 65536,
    defaultBudget: 4096,
    temperature: 0.1,
  },
} as const;
