"use client";

import { useState } from "react";
import Link from "next/link";
import { useT } from "@/lib/i18n/use-t";
import { LocaleSwitcher } from "@/components/site/locale-switcher";
import { Button } from "@/components/ui/button";
import {
  ShieldAlert,
  CheckCircle2,
  Clock,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  XCircle,
  Database,
  Cpu,
  FileCheck,
  Send,
  AlertTriangle,
  Play,
  Terminal,
} from "lucide-react";

type ApprovalStatus = "pending" | "approved" | "rejected";
type RunStatus = "idle" | "running" | "waiting_approval" | "completed" | "cancelled";

export default function AgentSpacePage() {
  const t = useT();
  const [runStatus, setRunStatus] = useState<RunStatus>("waiting_approval");
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("pending");
  const [promptInput, setPromptInput] = useState("");
  const [activeStep, setActiveStep] = useState<number>(3);

  const handleApprove = () => {
    setApprovalStatus("approved");
    setRunStatus("completed");
    setActiveStep(4);
  };

  const handleReject = () => {
    setApprovalStatus("rejected");
    setRunStatus("cancelled");
  };

  const handleReset = () => {
    setApprovalStatus("pending");
    setRunStatus("waiting_approval");
    setActiveStep(3);
  };

  const handleStartRun = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;
    setRunStatus("waiting_approval");
    setApprovalStatus("pending");
    setActiveStep(3);
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col overflow-x-hidden">
      {/* Top Header */}
      <header className="sticky top-0 z-40 border-b border-border/50 bg-background/85 backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-medium text-muted-foreground hover:text-foreground transition-colors group shrink-0"
              title={t("agent.backToHome", "Back to Home")}
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1 rtl:rotate-180 rtl:group-hover:translate-x-1" />
              <span className="hidden sm:inline">{t("agent.backToHome", "Back to Home")}</span>
            </Link>
            <span className="text-border hidden sm:inline">/</span>
            <div className="flex items-center gap-2 min-w-0">
              <span className="font-sans font-bold text-base sm:text-lg tracking-tight truncate">Agentnexos</span>
              <span className="hidden md:inline-flex text-[11px] font-mono px-2 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/20 shrink-0">
                {t("agent.badge", "Phase 3 Safe Shell")}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            <LocaleSwitcher />
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 mx-auto max-w-7xl w-full px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Title and Transparency Notice */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold tracking-tight">
                {t("agent.title", "Agent Space")}
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                {t("agent.subtitle", "Deterministic Execution Shell & Autonomous Multi-Agent Workspace")}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="gap-2 text-xs"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                {t("agent.actions.reset", "Reset Trace")}
              </Button>
            </div>
          </div>

          {/* Transparency Alert */}
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-amber-200/90 leading-relaxed">
              {t(
                "agent.banner.notice",
                "تنبيه الشفافية: هذه بيئة غلاف آمنة ومتحكم بها لاختبار دورة حياة الوكيل والموافقات. النماذج الحقيقية والاستمرارية ترتبط في المرحلتين 4 و5 دون أي تزييف."
              )}
            </p>
          </div>
        </div>

        {/* Diagnostics Bar */}
        <section aria-labelledby="diagnostics-heading" className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <h2 id="diagnostics-heading" className="sr-only">
            {t("agent.status.title", "Environment Diagnostics")}
          </h2>

          {/* Model Layer Card */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>{t("agent.status.model", "Model Layer")}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                {t("agent.status.stateReady", "Ready for Link")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-normal">
              {t("agent.status.modelDesc", "Groq (Qwen 3.8 27B / GPT-OSS 120B) configured in Vercel")}
            </p>
          </div>

          {/* Persistence Card */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>{t("agent.status.persistence", "Persistence")}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-muted text-muted-foreground border border-border">
                {t("agent.status.statePending", "Next Phase")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-normal">
              {t("agent.status.persistenceDesc", "Supabase state store (Phase 4)")}
            </p>
          </div>

          {/* Mode Card */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                <span>{t("agent.status.mode", "Operating Mode")}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                {t("agent.status.stateActive", "Active (Deterministic)")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-normal">
              {t("agent.status.modeDesc", "Safe Deterministic Preview (No fabricated responses)")}
            </p>
          </div>
        </section>

        {/* Workspace Layout: Contract + Trace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Execution Contract Card (Left Column) */}
          <section
            aria-labelledby="contract-heading"
            className="lg:col-span-1 p-5 rounded-2xl border border-border/60 bg-card/40 space-y-5"
          >
            <div className="flex items-center gap-2 border-b border-border/50 pb-3">
              <FileCheck className="w-4 h-4 text-primary" />
              <h2 id="contract-heading" className="text-sm font-semibold tracking-wide uppercase text-foreground">
                {t("agent.contract.title", "Active Execution Contract")}
              </h2>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <span className="text-muted-foreground block mb-1 font-mono uppercase tracking-wider text-[10px]">
                  {t("agent.contract.goal", "Goal")}
                </span>
                <p className="p-2.5 rounded-lg bg-background/80 border border-border/40 text-foreground leading-relaxed">
                  {t("agent.contract.goalValue", "Process enterprise operational request under strict permission boundaries")}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1 font-mono uppercase tracking-wider text-[10px]">
                  {t("agent.contract.source", "Source of Truth")}
                </span>
                <p className="p-2.5 rounded-lg bg-background/80 border border-border/40 text-foreground leading-relaxed">
                  {t("agent.contract.sourceValue", "Enterprise Knowledge Base & Connected Tools")}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1 font-mono uppercase tracking-wider text-[10px]">
                  {t("agent.contract.safety", "Safety Boundary")}
                </span>
                <p className="p-2.5 rounded-lg bg-background/80 border border-border/40 text-foreground leading-relaxed">
                  {t("agent.contract.safetyValue", "Read-only lookup by default; writes require human approval")}
                </p>
              </div>
            </div>

            {/* Run Management / Metadata */}
            <div className="pt-4 border-t border-border/40 space-y-2 text-xs font-mono text-muted-foreground">
              <div className="flex justify-between">
                <span>Thread ID:</span>
                <span className="text-foreground">th_ent_9281a</span>
              </div>
              <div className="flex justify-between">
                <span>Run ID:</span>
                <span className="text-foreground">run_det_3019</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-400 capitalize">{runStatus.replace("_", " ")}</span>
              </div>
            </div>
          </section>

          {/* Execution Trace & Approval Gateway (Right Column - 2 spans) */}
          <section
            aria-labelledby="trace-heading"
            className="lg:col-span-2 p-5 rounded-2xl border border-border/60 bg-card/40 space-y-6 flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-border/50 pb-3">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-primary" />
                  <h2 id="trace-heading" className="text-sm font-semibold tracking-wide uppercase text-foreground">
                    {t("agent.steps.title", "Run Execution Trace")}
                  </h2>
                </div>
                <span className="text-xs font-mono text-muted-foreground">Step {activeStep} / 4</span>
              </div>

              {/* Step Sequence */}
              <div className="space-y-4">
                {/* Step 1: Process Analysis */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/50 bg-background/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-foreground">
                      {t("agent.steps.step1.title", "1. Process Analysis")}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t("agent.steps.step1.desc", "Extract inputs, classify intent, and build deterministic execution contract.")}
                    </p>
                  </div>
                </div>

                {/* Step 2: Tool Execution (Read) */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/50 bg-background/60">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-foreground">
                      {t("agent.steps.step2.title", "2. Tool Execution (Read-Only)")}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t("agent.steps.step2.desc", "Query verified enterprise knowledge source with timeout and SSRF protection.")}
                    </p>
                  </div>
                </div>

                {/* Step 3: Approval Gate (Human in the Loop) */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    approvalStatus === "pending"
                      ? "border-amber-500/40 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                      : approvalStatus === "approved"
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : "border-red-500/30 bg-red-500/5"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <Clock
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          approvalStatus === "pending"
                            ? "text-amber-400 animate-pulse"
                            : approvalStatus === "approved"
                            ? "text-emerald-400"
                            : "text-red-400"
                        }`}
                      />
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-semibold text-foreground">
                            {t("agent.steps.step3.title", "3. Approval Gate (Human-in-the-Loop)")}
                          </h3>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                              approvalStatus === "pending"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : approvalStatus === "approved"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : "bg-red-500/20 text-red-300 border-red-500/30"
                            }`}
                          >
                            {approvalStatus === "pending"
                              ? t("agent.approval.badge", "Pending Approval")
                              : approvalStatus === "approved"
                              ? t("agent.approval.approved", "Action Approved")
                              : t("agent.approval.rejected", "Action Rejected")}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {t("agent.steps.step3.desc", "Sensitive action detected. Pausing execution until explicit owner approval.")}
                        </p>
                        <p className="text-xs font-mono text-foreground/90 mt-2 p-2 rounded bg-background/70 border border-border/40">
                          {t(
                            "agent.approval.prompt",
                            "Action requires authorization: Export operational audit report to external destination."
                          )}
                        </p>
                      </div>
                    </div>
                  </div>

                  {approvalStatus === "pending" && (
                    <div className="mt-4 pt-3 border-t border-amber-500/20 flex flex-wrap gap-2 justify-end">
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={handleReject}
                        className="text-xs h-8 px-4"
                      >
                        <XCircle className="w-3.5 h-3.5 mr-1 rtl:ml-1" />
                        {t("agent.approval.reject", "Reject Action")}
                      </Button>
                      <Button
                        size="sm"
                        onClick={handleApprove}
                        className="text-xs h-8 px-4 bg-emerald-600 hover:bg-emerald-500 text-white"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1 rtl:ml-1" />
                        {t("agent.approval.approve", "Approve Action")}
                      </Button>
                    </div>
                  )}
                </div>

                {/* Step 4: Evidence & Audit Log */}
                {approvalStatus === "approved" && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1">
                      <h3 className="text-xs font-semibold text-foreground">
                        {t("agent.steps.step4.title", "4. Evidence Verification & Audit")}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t("agent.steps.step4.desc", "Validate output state from target system and register audit trace.")}
                      </p>
                      <div className="text-[11px] font-mono text-muted-foreground bg-background/80 p-2 rounded border border-border/40 mt-1">
                        sha256:8f4c2b9a10de3817... [Verified in Evidence Log]
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Prompt Input Area */}
            <div className="pt-6 border-t border-border/40 space-y-2">
              <form onSubmit={handleStartRun} className="flex gap-2">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder={t(
                    "agent.input.placeholder",
                    "Enter prompt for enterprise agent (Multi-agent streaming activates in Phase 5)..."
                  )}
                  className="flex-1 rounded-xl bg-background border border-border/60 px-4 py-2 text-xs sm:text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary"
                />
                <Button type="submit" size="sm" className="rounded-xl px-4 gap-1.5 text-xs">
                  <span>{t("agent.input.send", "Submit")}</span>
                  <Send className="w-3.5 h-3.5" />
                </Button>
              </form>
              <p className="text-[11px] text-muted-foreground">
                {t(
                  "agent.input.note",
                  "Live model streaming & database sessions will be linked in Phases 4 & 5."
                )}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
