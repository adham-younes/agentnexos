/**
 * Enterprise Prompt Injection & Input Defense Guard for Agentnexos
 * Protects against prompt injection, jailbreaks, delimiter hijacking, and exfiltration attempts
 * in both Arabic and English.
 */

export interface PromptGuardResult {
  isSafe: boolean;
  reason?: string;
  category?: "jailbreak" | "system_override" | "delimiter_injection" | "exfiltration" | "code_injection";
  severity?: "low" | "medium" | "high" | "critical";
}

// Patterns indicative of system prompt override or instruction hijacking
const OVERRIDE_PATTERNS = [
  /ignore\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules|directives)/i,
  /disregard\s+(all\s+)?(previous|prior|above)\s+(instructions|prompts|rules)/i,
  /forget\s+(everything|all\s+rules|previous\s+instructions)/i,
  /you\s+are\s+now\s+(unrestricted|in\s+developer\s+mode|dan|jailbroken)/i,
  /enter\s+developer\s+mode/i,
  /bypass\s+(safety|guardrails|filters|content\s+policy)/i,
  /output\s+the\s+(system\s+prompt|initial\s+prompt|secret\s+instructions)/i,
  /reveal\s+your\s+(system\s+instructions|system\s+prompt|hidden\s+rules)/i,
  /print\s+your\s+(system\s+instructions|internal\s+prompt)/i,
  // Arabic attack vectors
  /تجاهل\s+(كافة\s+|جميع\s+|كل\s+)?(التعليمات|الأوامر|القواعد)\s+(السابقة|الموجهة|الأساسية)/,
  /انسى\s+(كل\s+|كافة\s+)?(التعليمات|القواعد|الأوامر)/,
  /أنت\s+الآن\s+(حر|غير\s+مقيد|في\s+وضع\s+المطور|خارج\s+السيطرة)/,
  /تجاوز\s+(حواجز\s+الأمان|قواعد\s+الأمان|السياسات|الفلاتر)/,
  /اطبع\s+(التعليمات\s+السرية|موجه\s+النظام|الأوامر\s+الداخلية)/,
  /اكشف\s+(عن\s+)?(تعليمات\s+النظام|أسرار\s+البرمجة|الموجه\s+الداخلي)/,
  /أظهر\s+رسالة\s+النظام\s+الأصلية/,
];

// Structural prompt delimiters that could hijack LLM context boundaries
const DELIMITER_PATTERNS = [
  /<\|im_start\|>/i,
  /<\|im_end\|>/i,
  /###\s*(system|instruction|human|assistant):/i,
  /\[SYSTEM_PROMPT\]/i,
  /\[\/SYSTEM_PROMPT\]/i,
  /<<SYS>>/i,
  /<\/SYS>>/i,
  /---BEGIN\s+(SYSTEM|INTERNAL)\s+(PROMPT|INSTRUCTION)---/i,
];

// Dangerous code or exfiltration patterns
const CODE_EXFILTRATION_PATTERNS = [
  /process\.env\b/i,
  /__dirname\b/,
  /require\s*\(\s*['"]child_process['"]\s*\)/i,
  /eval\s*\(.+?\)/i,
  /<script\b[^>]*>[\s\S]*?<\/script>/i,
  /\bjavascript:\s*/i,
  /(\bcurl|\bwget)\s+https?:\/\//i,
];

/**
 * Validates input text against known prompt injection, delimiter hijacking, and jailbreak patterns.
 */
export function validatePromptSafety(prompt: string): PromptGuardResult {
  if (!prompt || typeof prompt !== "string") {
    return { isSafe: true };
  }

  const normalized = prompt.trim();

  // 1. Check for Delimiter Hijacking (Critical)
  for (const pattern of DELIMITER_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isSafe: false,
        reason: "Detected attempted delimiter hijacking or prompt frame injection.",
        category: "delimiter_injection",
        severity: "critical",
      };
    }
  }

  // 2. Check for Code Injection & Exfiltration (High)
  for (const pattern of CODE_EXFILTRATION_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isSafe: false,
        reason: "Detected potential script execution, shell invocation, or environment exfiltration pattern.",
        category: "code_injection",
        severity: "high",
      };
    }
  }

  // 3. Check for Instruction Override & Jailbreaks (High)
  for (const pattern of OVERRIDE_PATTERNS) {
    if (pattern.test(normalized)) {
      return {
        isSafe: false,
        reason: "Detected attempted system override, instruction bypass, or prompt jailbreak vector.",
        category: "system_override",
        severity: "high",
      };
    }
  }

  return { isSafe: true };
}
