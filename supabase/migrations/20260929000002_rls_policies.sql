-- ============================================================
-- Agentnexos — Phase 4 Row-Level Security (RLS) & Tenant Isolation
-- Enforces strict multi-tenant boundary separation
-- ============================================================

-- 1. Helper security functions
CREATE OR REPLACE FUNCTION public.is_org_member(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships
    WHERE organization_id = target_org_id
      AND user_id = auth.uid()
  );
$$;

CREATE OR REPLACE FUNCTION public.is_org_admin(target_org_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
SECURITY DEFINER
STABLE
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.memberships
    WHERE organization_id = target_org_id
      AND user_id = auth.uid()
      AND role IN ('owner', 'admin')
  );
$$;

-- 2. Enable RLS on all tables
ALTER TABLE public.organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memberships ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_threads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_runs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agent_steps ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tool_calls ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.approvals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.artifacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.memories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integration_connections ENABLE ROW LEVEL SECURITY;

-- 3. Profiles policies
CREATE POLICY "Users can view own profile"
    ON public.profiles FOR SELECT
    USING (id = auth.uid());

CREATE POLICY "Users can update own profile"
    ON public.profiles FOR UPDATE
    USING (id = auth.uid());

-- 4. Organizations policies
CREATE POLICY "Members can view their organization"
    ON public.organizations FOR SELECT
    USING (public.is_org_member(id));

CREATE POLICY "Admins can update their organization"
    ON public.organizations FOR UPDATE
    USING (public.is_org_admin(id));

-- 5. Memberships policies
CREATE POLICY "Members can view organization memberships"
    ON public.memberships FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Admins can manage memberships"
    ON public.memberships FOR ALL
    USING (public.is_org_admin(organization_id));

-- 6. Agent Threads policies
CREATE POLICY "Tenant isolation for threads - SELECT"
    ON public.agent_threads FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for threads - INSERT"
    ON public.agent_threads FOR INSERT
    WITH CHECK (public.is_org_member(organization_id) AND created_by = auth.uid());

CREATE POLICY "Tenant isolation for threads - UPDATE"
    ON public.agent_threads FOR UPDATE
    USING (public.is_org_member(organization_id));

-- 7. Agent Messages policies
CREATE POLICY "Tenant isolation for messages - SELECT"
    ON public.agent_messages FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for messages - INSERT"
    ON public.agent_messages FOR INSERT
    WITH CHECK (public.is_org_member(organization_id));

-- 8. Agent Runs policies
CREATE POLICY "Tenant isolation for runs - SELECT"
    ON public.agent_runs FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for runs - INSERT"
    ON public.agent_runs FOR INSERT
    WITH CHECK (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for runs - UPDATE"
    ON public.agent_runs FOR UPDATE
    USING (public.is_org_member(organization_id));

-- 9. Agent Steps policies
CREATE POLICY "Tenant isolation for steps - SELECT"
    ON public.agent_steps FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for steps - INSERT"
    ON public.agent_steps FOR INSERT
    WITH CHECK (public.is_org_member(organization_id));

-- 10. Tool Calls policies
CREATE POLICY "Tenant isolation for tool calls - SELECT"
    ON public.tool_calls FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for tool calls - INSERT"
    ON public.tool_calls FOR INSERT
    WITH CHECK (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for tool calls - UPDATE"
    ON public.tool_calls FOR UPDATE
    USING (public.is_org_member(organization_id));

-- 11. Approvals policies
CREATE POLICY "Tenant isolation for approvals - SELECT"
    ON public.approvals FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for approvals - INSERT"
    ON public.approvals FOR INSERT
    WITH CHECK (public.is_org_member(organization_id));

CREATE POLICY "Only admins or reviewers can decide approvals"
    ON public.approvals FOR UPDATE
    USING (
      EXISTS (
        SELECT 1 FROM public.memberships
        WHERE organization_id = approvals.organization_id
          AND user_id = auth.uid()
          AND role IN ('owner', 'admin', 'reviewer')
      )
    );

-- 12. Artifacts policies
CREATE POLICY "Tenant isolation for artifacts - SELECT"
    ON public.artifacts FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for artifacts - INSERT"
    ON public.artifacts FOR INSERT
    WITH CHECK (public.is_org_member(organization_id));

-- 13. Audit Events policies (Immutable Append-Only)
CREATE POLICY "Members can view audit events in their org"
    ON public.audit_events FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Audit events append-only INSERT"
    ON public.audit_events FOR INSERT
    WITH CHECK (public.is_org_member(organization_id));

-- Notice: NO UPDATE OR DELETE POLICIES for audit_events to guarantee tamper-proof audit trails.

-- 14. Memories policies
CREATE POLICY "Tenant isolation for memories - SELECT"
    ON public.memories FOR SELECT
    USING (public.is_org_member(organization_id));

CREATE POLICY "Tenant isolation for memories - INSERT"
    ON public.memories FOR INSERT
    WITH CHECK (public.is_org_member(organization_id));

-- 15. Integration Connections policies
CREATE POLICY "Admins can view integration connections"
    ON public.integration_connections FOR SELECT
    USING (public.is_org_admin(organization_id));

CREATE POLICY "Admins can manage integration connections"
    ON public.integration_connections FOR ALL
    USING (public.is_org_admin(organization_id));
