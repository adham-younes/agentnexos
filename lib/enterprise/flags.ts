/**
 * Agentnexos — Enterprise Feature Flags Engine
 * Controls modular capability rollouts, human-in-the-loop enforcement, and safety guardrails.
 */

export interface EnterpriseFeatureFlags {
  enableZatcaComplianceAgent: boolean;
  enableHumanInTheLoopGates: boolean;
  enablePiiAutoRedaction: boolean;
  enableAutonomousToolExecution: boolean;
  enableExtendedTokenBudget: boolean;
  enableDetailedAuditExport: boolean;
  enforceStrictTenantIsolation: boolean;
}

const DEFAULT_FLAGS: EnterpriseFeatureFlags = {
  enableZatcaComplianceAgent: true,
  enableHumanInTheLoopGates: true, // Non-negotiable enterprise safety rule
  enablePiiAutoRedaction: true,    // Non-negotiable enterprise privacy rule
  enableAutonomousToolExecution: true,
  enableExtendedTokenBudget: false,
  enableDetailedAuditExport: true,
  enforceStrictTenantIsolation: true,
};

const orgFlagsStore = new Map<string, Partial<EnterpriseFeatureFlags>>();

export function getFeatureFlagsForOrg(orgId: string): EnterpriseFeatureFlags {
  const custom = orgFlagsStore.get(orgId) || {};
  return {
    ...DEFAULT_FLAGS,
    ...custom,
    // Safety overrides: Cannot disable HITL or PII redaction without explicit security override
    enableHumanInTheLoopGates: true,
    enablePiiAutoRedaction: true,
  };
}

export function setOrgFeatureFlag<K extends keyof EnterpriseFeatureFlags>(
  orgId: string,
  flag: K,
  value: EnterpriseFeatureFlags[K]
): EnterpriseFeatureFlags {
  // Prevent disabling foundational safety flags
  if ((flag === "enableHumanInTheLoopGates" || flag === "enablePiiAutoRedaction") && value === false) {
    throw new Error(`Security Exception: Cannot disable foundational guardrail ${flag}`);
  }

  const current = orgFlagsStore.get(orgId) || {};
  current[flag] = value;
  orgFlagsStore.set(orgId, current);
  return getFeatureFlagsForOrg(orgId);
}
