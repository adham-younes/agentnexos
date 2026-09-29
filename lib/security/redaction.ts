/**
 * Data Sanitization & PII/Secret Redaction Module
 * Redacts sensitive credentials, tokens, payment cards, national IDs, and personal identifiers
 * prior to LLM processing and persistent audit logging.
 */

export interface RedactionResult {
  redactedText: string;
  hasRedactions: boolean;
  redactedCategories: string[];
}

// Patterns for credential and secret token detection
const SECRET_PATTERNS = [
  { name: "groq_api_key", regex: /\bgsk_[a-zA-Z0-9_-]{20,}\b/g, label: "[REDACTED_API_KEY]" },
  { name: "generic_api_key", regex: /\bsk-[a-zA-Z0-9_-]{20,}\b/g, label: "[REDACTED_API_KEY]" },
  { name: "jwt_bearer", regex: /\bBearer\s+[a-zA-Z0-9._-]{30,}\b/g, label: "Bearer [REDACTED_TOKEN]" },
];

// Patterns for Payment Cards (Visa, MasterCard, Amex: 13-19 digits with optional hyphens/spaces)
const CREDIT_CARD_PATTERN = {
  name: "credit_card",
  regex: /\b(?:\d[ -]*?){13,16}\b/g,
  label: "[REDACTED_PAYMENT_CARD]",
  validator: (match: string) => {
    const digits = match.replace(/\D/g, "");
    if (digits.length < 13 || digits.length > 19) return false;
    // Basic Luhn algorithm validation
    let sum = 0;
    let shouldDouble = false;
    for (let i = digits.length - 1; i >= 0; i--) {
      let digit = parseInt(digits.charAt(i), 10);
      if (shouldDouble) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
      shouldDouble = !shouldDouble;
    }
    return sum % 10 === 0;
  },
};

// Patterns for MENA National IDs (e.g. KSA National ID/Iqama: 10 digits starting with 1 or 2; Egypt: 14 digits)
const NATIONAL_ID_PATTERNS = [
  { name: "ksa_national_id", regex: /\b[12]\d{9}\b/g, label: "[REDACTED_NATIONAL_ID]" },
  { name: "egypt_national_id", regex: /\b[23]\d{13}\b/g, label: "[REDACTED_NATIONAL_ID]" },
];

// General PII
const PII_PATTERNS = [
  { name: "email", regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,7}\b/g, label: "[REDACTED_EMAIL]" },
  { name: "phone_mena", regex: /(?:\+|00)(?:966|20|971|965|974|973|968)\d{8,11}\b/g, label: "[REDACTED_PHONE]" },
];

/**
 * Sanitizes input text by replacing PII and secrets with privacy labels.
 */
export function sanitizeAndRedact(text: string): RedactionResult {
  if (!text || typeof text !== "string") {
    return { redactedText: "", hasRedactions: false, redactedCategories: [] };
  }

  let result = text;
  const detectedCategories = new Set<string>();

  // 1. Redact API Keys & Tokens
  for (const { name, regex, label } of SECRET_PATTERNS) {
    if (regex.test(result)) {
      detectedCategories.add(name);
      result = result.replace(regex, label);
    }
  }

  // 2. Redact Validated Credit Cards
  result = result.replace(CREDIT_CARD_PATTERN.regex, (match) => {
    if (CREDIT_CARD_PATTERN.validator(match)) {
      detectedCategories.add("credit_card");
      return CREDIT_CARD_PATTERN.label;
    }
    return match;
  });

  // 3. Redact National IDs
  for (const { name, regex, label } of NATIONAL_ID_PATTERNS) {
    if (regex.test(result)) {
      detectedCategories.add(name);
      result = result.replace(regex, label);
    }
  }

  // 4. Redact Emails & Phone Numbers
  for (const { name, regex, label } of PII_PATTERNS) {
    if (regex.test(result)) {
      detectedCategories.add(name);
      result = result.replace(regex, label);
    }
  }

  return {
    redactedText: result,
    hasRedactions: detectedCategories.size > 0,
    redactedCategories: Array.from(detectedCategories),
  };
}
