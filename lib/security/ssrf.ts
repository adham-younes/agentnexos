/**
 * Server-Side Request Forgery (SSRF) Protection Utility
 * Enforces strict network boundaries for external enterprise agent tools.
 */

const BLOCKED_IP_PATTERNS = [
  /^127\./, // Loopback
  /^10\./, // Private RFC1918 Class A
  /^172\.(1[6-9]|2[0-9]|3[0-1])\./, // Private RFC1918 Class B
  /^192\.168\./, // Private RFC1918 Class C
  /^169\.254\./, // Link-local / Cloud metadata (AWS, GCP, Azure, DigitalOcean)
  /^0\./, // Current network
  /^::1$/, // IPv6 loopback
  /^fc00:/, // IPv6 Unique local
  /^fe80:/, // IPv6 Link-local
];

const BLOCKED_HOSTNAMES = [
  "localhost",
  "metadata.google.internal",
  "instance-data",
  "169.254.169.254",
  "0.0.0.0",
];

export function validateSafeDestinationUrl(rawUrl: string): { isValid: boolean; sanitizedUrl?: string; error?: string } {
  try {
    const parsed = new URL(rawUrl);

    // Protocol must be HTTPS
    if (parsed.protocol !== "https:") {
      return { isValid: false, error: "Only secure HTTPS protocol is permitted for enterprise tool destinations." };
    }

    const hostname = parsed.hostname.toLowerCase();

    // Check blocked hostnames
    if (BLOCKED_HOSTNAMES.includes(hostname) || hostname.endsWith(".local") || hostname.endsWith(".internal")) {
      return { isValid: false, error: `Destination host [${hostname}] is blocked by SSRF protection boundary.` };
    }

    // Check IP patterns
    for (const pattern of BLOCKED_IP_PATTERNS) {
      if (pattern.test(hostname)) {
        return { isValid: false, error: `Destination IP [${hostname}] is a private/internal network address and cannot be accessed.` };
      }
    }

    return { isValid: true, sanitizedUrl: parsed.toString() };
  } catch {
    return { isValid: false, error: "Malformed destination URL provided." };
  }
}
