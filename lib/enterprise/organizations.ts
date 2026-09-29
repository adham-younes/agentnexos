/**
 * Agentnexos — Enterprise Pilot Organizations & Multi-Tenant Management
 * Manages enterprise tenant profiles, onboarding workflows, and tenant isolation boundaries.
 */

export interface EnterpriseOrganization {
  id: string;
  name: string;
  nameAr: string;
  slug: string;
  industry: "logistics" | "finance" | "retail" | "manufacturing" | "healthcare";
  country: "SA" | "AE" | "EG" | "KW" | "QA";
  tier: "pilot_beta" | "enterprise_standard" | "enterprise_dedicated";
  status: "active" | "onboarding" | "suspended";
  doaLimitSar: number; // Delegation of Authority threshold in SAR
  complianceFrameworks: ("zatca_phase_2" | "pdpl_saudi" | "eg_data_protection" | "iso_27001")[];
  allowedDomains: string[];
  maxMonthlyRuns: number;
  maxHourlyTokens: number;
  createdAt: string;
}

export const PILOT_ORGANIZATIONS: EnterpriseOrganization[] = [
  {
    id: "org_pilot_acme",
    name: "Acme Saudi Logistics",
    nameAr: "شركة أكمي السعودية للخدمات اللوجستية",
    slug: "acme-saudi-logistics",
    industry: "logistics",
    country: "SA",
    tier: "pilot_beta",
    status: "active",
    doaLimitSar: 100000,
    complianceFrameworks: ["zatca_phase_2", "pdpl_saudi"],
    allowedDomains: ["acme-logistics.sa", "acme.com.sa"],
    maxMonthlyRuns: 500,
    maxHourlyTokens: 200000,
    createdAt: "2026-09-01T00:00:00Z",
  },
  {
    id: "org_pilot_gulf_fin",
    name: "Gulf Finance Holding",
    nameAr: "القابضة الخليجية للتمويل",
    slug: "gulf-finance-holding",
    industry: "finance",
    country: "AE",
    tier: "pilot_beta",
    status: "active",
    doaLimitSar: 500000,
    complianceFrameworks: ["iso_27001"],
    allowedDomains: ["gulffinance.ae"],
    maxMonthlyRuns: 1000,
    maxHourlyTokens: 500000,
    createdAt: "2026-09-10T00:00:00Z",
  },
  {
    id: "org_pilot_cairo_retail",
    name: "Cairo Retail Group",
    nameAr: "مجموعة القاهرة لتجارة التجزئة",
    slug: "cairo-retail-group",
    industry: "retail",
    country: "EG",
    tier: "pilot_beta",
    status: "active",
    doaLimitSar: 50000,
    complianceFrameworks: ["eg_data_protection"],
    allowedDomains: ["cairoretail.eg"],
    maxMonthlyRuns: 300,
    maxHourlyTokens: 150000,
    createdAt: "2026-09-15T00:00:00Z",
  },
];

const orgStore = new Map<string, EnterpriseOrganization>(
  PILOT_ORGANIZATIONS.map((org) => [org.id, org])
);

export function getOrganizationById(id: string): EnterpriseOrganization | undefined {
  return orgStore.get(id);
}

export function listOrganizations(): EnterpriseOrganization[] {
  return Array.from(orgStore.values());
}

export interface OnboardOrganizationParams {
  name: string;
  nameAr?: string;
  industry: EnterpriseOrganization["industry"];
  country: EnterpriseOrganization["country"];
  doaLimitSar?: number;
  complianceFrameworks?: EnterpriseOrganization["complianceFrameworks"];
  adminEmail: string;
}

export function onboardPilotOrganization(params: OnboardOrganizationParams): EnterpriseOrganization {
  const orgId = `org_${Math.random().toString(36).substring(2, 9)}`;
  const slug = params.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const newOrg: EnterpriseOrganization = {
    id: orgId,
    name: params.name,
    nameAr: params.nameAr || params.name,
    slug,
    industry: params.industry,
    country: params.country,
    tier: "pilot_beta",
    status: "active",
    doaLimitSar: params.doaLimitSar || 75000,
    complianceFrameworks: params.complianceFrameworks || ["zatca_phase_2"],
    allowedDomains: [params.adminEmail.split("@")[1] || "enterprise.local"],
    maxMonthlyRuns: 300,
    maxHourlyTokens: 150000,
    createdAt: new Date().toISOString(),
  };

  orgStore.set(orgId, newOrg);
  return newOrg;
}
