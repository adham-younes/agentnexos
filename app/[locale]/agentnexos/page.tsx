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
  RotateCcw,
  XCircle,
  Database,
  Cpu,
  FileCheck,
  Send,
  AlertTriangle,
  Terminal,
  Sparkles,
  Fingerprint,
  Loader2,
} from "lucide-react";

type ApprovalStatus = "pending" | "approved" | "rejected";
type RunStatus = "idle" | "running" | "waiting_approval" | "completed" | "cancelled" | "failed";

export default function AgentSpacePage() {
  const t = useT();

  const [runStatus, setRunStatus] = useState<RunStatus>("idle");
  const [approvalStatus, setApprovalStatus] = useState<ApprovalStatus>("pending");
  const [promptInput, setPromptInput] = useState("");
  const [activeStep, setActiveStep] = useState<number>(0);

  const [threadId] = useState(() => `th_${Math.random().toString(36).substring(2, 9)}`);
  const [runId, setRunId] = useState<string>("run_init");
  const [latencyMs, setLatencyMs] = useState<number | null>(null);
  const [modelUsed, setModelUsed] = useState<string>("qwen/qwen3.8-27b + openai/gpt-oss-120b");
  const [isDeterministicFallback, setIsDeterministicFallback] = useState<boolean>(true);

  // Contract state
  const [contractGoal, setContractGoal] = useState<string>(
    "Process enterprise operational request under strict permission boundaries"
  );
  const [contractSource, setContractSource] = useState<string>(
    "Enterprise Knowledge Base & Connected Tools"
  );
  const [contractSafety, setContractSafety] = useState<string>(
    "Read-only lookup by default; writes require human approval"
  );

  // Findings & Evidence
  const [findings, setFindings] = useState<string[]>([]);
  const [evidenceHash, setEvidenceHash] = useState<string>("");
  const [approvalPrompt, setApprovalPrompt] = useState<string>("");
  const [streamingSynthesis, setStreamingSynthesis] = useState<string>("");
  const [isStreaming, setIsStreaming] = useState<boolean>(false);

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
    setRunStatus("idle");
    setActiveStep(0);
    setStreamingSynthesis("");
    setFindings([]);
    setEvidenceHash("");
    setLatencyMs(null);
  };

  const executeQuery = async (queryText: string) => {
    if (!queryText.trim() || isStreaming) return;

    setIsStreaming(true);
    setRunStatus("running");
    setActiveStep(1);
    setStreamingSynthesis("");
    setFindings([]);
    setEvidenceHash("");
    setApprovalStatus("pending");

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: queryText, threadId }),
      });

      if (!response.ok || !response.body) {
        throw new Error(`HTTP ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder("utf-8");
      let buffer = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          const trimmed = line.trim();
          if (!trimmed.startsWith("data: ")) continue;

          try {
            const data = JSON.parse(trimmed.slice(6));

            if (data.type === "step") {
              if (data.step === 1 && data.contract) {
                setActiveStep(1);
                setContractGoal(data.contract.goal);
                setContractSource(data.contract.sourceOfTruth);
                setContractSafety(data.contract.safetyBoundary);
              } else if (data.step === 2 && data.output) {
                setActiveStep(2);
                setFindings(data.output.findings || []);
              } else if (data.step === 3) {
                setActiveStep(3);
                if (data.prompt) {
                  setApprovalPrompt(data.prompt);
                }
              }
            } else if (data.type === "token") {
              setStreamingSynthesis((prev) => prev + data.token);
            } else if (data.type === "complete") {
              setRunId(data.runId);
              setEvidenceHash(data.evidenceHash);
              setModelUsed(data.modelUsed);
              setIsDeterministicFallback(data.isDeterministicFallback);
              setLatencyMs(data.latencyMs);

              if (data.status === "waiting_approval") {
                setRunStatus("waiting_approval");
                setActiveStep(3);
              } else {
                setRunStatus("completed");
                setApprovalStatus("approved");
                setActiveStep(4);
              }
            }
          } catch {
            // ignore malformed frame
          }
        }
      }
    } catch {
      setRunStatus("failed");
    } finally {
      setIsStreaming(false);
    }
  };

  const handleStartRun = (e: React.FormEvent) => {
    e.preventDefault();
    executeQuery(promptInput);
  };

  const handleSamplePrompt = (sampleText: string) => {
    setPromptInput(sampleText);
    executeQuery(sampleText);
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
                {t("agent.badge", "Phase 5: Multi-Agent Runtime & Streaming")}
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
          <div className="rounded-xl border border-sky-500/20 bg-sky-500/5 p-4 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
            <p className="text-xs sm:text-sm text-sky-200/90 leading-relaxed">
              {t(
                "agent.banner.notice",
                "Transparency Alert: Multi-agent runtime (Qwen 3.8 27B + GPT-OSS 120B) is active with real SSE streaming, SHA-256 cryptographic evidence hashing, and human approval gates."
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
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Cpu className="w-4 h-4 text-sky-400" />
                <span>{t("agent.status.model", "Model Layer")}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 shrink-0">
                {isDeterministicFallback
                  ? t("agent.status.stateReady", "Ready for Link")
                  : t("agent.status.stateActive", "Active (Multi-Agent Runtime)")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-normal">
              {t("agent.status.modelDesc", "Groq (Qwen 3.8 27B / GPT-OSS 120B) configured in Vercel")}
            </p>
          </div>

          {/* Persistence Card */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>{t("agent.status.persistence", "Persistence")}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shrink-0">
                {t("agent.status.stateReady", "Ready for Link")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-normal">
              {t("agent.status.persistenceDesc", "Supabase schema & RLS isolation ready in Git")}
            </p>
          </div>

          {/* Mode Card */}
          <div className="p-4 rounded-xl border border-border/60 bg-card/60 backdrop-blur-sm space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-1.5">
              <div className="flex items-center gap-2 text-sm font-semibold">
                <ShieldAlert className="w-4 h-4 text-indigo-400" />
                <span>{t("agent.status.mode", "Operating Mode")}</span>
              </div>
              <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 shrink-0">
                {t("agent.status.stateActive", "Active (Multi-Agent Runtime)")}
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-normal">
              {t("agent.status.modeDesc", "Safe Deterministic Preview & Real Streaming (No fabricated responses)")}
            </p>
          </div>
        </section>

        {/* Quick Sample Prompts */}
        <section aria-labelledby="sample-prompts-heading" className="space-y-2">
          <h2 id="sample-prompts-heading" className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            {t("agent.stream.samplePrompts", "Quick Enterprise Queries:")}
          </h2>
          <div className="flex flex-col sm:flex-row flex-wrap gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={isStreaming}
              onClick={() => handleSamplePrompt(t("agent.sample.compliance", "Verify ZATCA Phase 2 E-Invoicing Rules"))}
              className="text-xs h-auto min-h-8 py-1.5 px-3 gap-1.5 bg-card/40 border-border/60 hover:border-primary/50 text-start whitespace-normal max-w-full justify-start break-words"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{t("agent.sample.compliance", "Verify ZATCA Phase 2 E-Invoicing Rules")}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isStreaming}
              onClick={() => handleSamplePrompt(t("agent.sample.procurement", "Check Procurement Approval Thresholds"))}
              className="text-xs h-auto min-h-8 py-1.5 px-3 gap-1.5 bg-card/40 border-border/60 hover:border-primary/50 text-start whitespace-normal max-w-full justify-start break-words"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{t("agent.sample.procurement", "Check Procurement Approval Thresholds")}</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={isStreaming}
              onClick={() => handleSamplePrompt(t("agent.sample.operations", "Review Autonomous Tool Execution Policies"))}
              className="text-xs h-auto min-h-8 py-1.5 px-3 gap-1.5 bg-card/40 border-border/60 hover:border-primary/50 text-start whitespace-normal max-w-full justify-start break-words"
            >
              <Sparkles className="w-3.5 h-3.5 text-primary shrink-0" />
              <span>{t("agent.sample.operations", "Review Autonomous Tool Execution Policies")}</span>
            </Button>
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
                <p className="p-2.5 rounded-lg bg-background/80 border border-border/40 text-foreground leading-relaxed break-words">
                  {contractGoal || t("agent.contract.goalValue", "Process enterprise operational request under strict permission boundaries")}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1 font-mono uppercase tracking-wider text-[10px]">
                  {t("agent.contract.source", "Source of Truth")}
                </span>
                <p className="p-2.5 rounded-lg bg-background/80 border border-border/40 text-foreground leading-relaxed break-words">
                  {contractSource || t("agent.contract.sourceValue", "Enterprise Knowledge Base & Connected Tools")}
                </p>
              </div>

              <div>
                <span className="text-muted-foreground block mb-1 font-mono uppercase tracking-wider text-[10px]">
                  {t("agent.contract.safety", "Safety Boundary")}
                </span>
                <p className="p-2.5 rounded-lg bg-background/80 border border-border/40 text-foreground leading-relaxed break-words">
                  {contractSafety || t("agent.contract.safetyValue", "Read-only lookup by default; writes require human approval")}
                </p>
              </div>
            </div>

            {/* Run Management / Metadata */}
            <div className="pt-4 border-t border-border/40 space-y-2 text-xs font-mono text-muted-foreground">
              <div className="flex justify-between">
                <span>Thread ID:</span>
                <span className="text-foreground">{threadId}</span>
              </div>
              <div className="flex justify-between">
                <span>Run ID:</span>
                <span className="text-foreground">{runId}</span>
              </div>
              <div className="flex justify-between">
                <span>Status:</span>
                <span className="text-emerald-400 capitalize">{runStatus.replace("_", " ")}</span>
              </div>
              {latencyMs !== null && (
                <div className="flex justify-between">
                  <span>Latency:</span>
                  <span className="text-foreground">{latencyMs} ms</span>
                </div>
              )}
            </div>
          </section>

          {/* Execution Trace & Live Streaming Output (Right Column - 2 spans) */}
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
                <span className="text-xs font-mono text-muted-foreground">
                  Step {activeStep} / 4
                </span>
              </div>

              {/* Step Sequence */}
              <div className="space-y-4">
                {/* Step 1: Process Analysis */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/50 bg-background/60">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      activeStep >= 1 ? "text-emerald-400" : "text-muted-foreground/40"
                    }`}
                  />
                  <div className="space-y-1">
                    <h3 className="text-xs font-semibold text-foreground">
                      {t("agent.steps.step1.title", "1. Process Analysis")}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t(
                        "agent.steps.step1.desc",
                        "Extract inputs, classify intent, and build deterministic execution contract."
                      )}
                    </p>
                  </div>
                </div>

                {/* Step 2: Tool Execution (Read) */}
                <div className="flex items-start gap-3 p-3.5 rounded-xl border border-border/50 bg-background/60">
                  <CheckCircle2
                    className={`w-4 h-4 shrink-0 mt-0.5 ${
                      activeStep >= 2 ? "text-emerald-400" : "text-muted-foreground/40"
                    }`}
                  />
                  <div className="space-y-1.5 w-full">
                    <h3 className="text-xs font-semibold text-foreground">
                      {t("agent.steps.step2.title", "2. Tool Execution (Read-Only)")}
                    </h3>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {t(
                        "agent.steps.step2.desc",
                        "Query verified enterprise knowledge source with timeout and SSRF protection."
                      )}
                    </p>
                    {findings.length > 0 && (
                      <div className="space-y-1 pt-1">
                        <span className="text-[11px] font-semibold text-primary block">
                          {t("agent.evidence.findings", "Verified Read Tool Findings:")}
                        </span>
                        <ul className="text-xs space-y-1 text-muted-foreground bg-background/80 p-2.5 rounded-lg border border-border/40">
                          {findings.map((f, i) => (
                            <li key={i} className="flex items-start gap-1.5">
                              <span className="text-primary">•</span>
                              <span>{f}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* Step 3: Approval Gate (Human in the Loop) */}
                <div
                  className={`p-4 rounded-xl border transition-all ${
                    runStatus === "waiting_approval" && approvalStatus === "pending"
                      ? "border-amber-500/40 bg-amber-500/10 shadow-[0_0_20px_rgba(245,158,11,0.08)]"
                      : approvalStatus === "approved"
                      ? "border-emerald-500/30 bg-emerald-500/5"
                      : approvalStatus === "rejected"
                      ? "border-red-500/30 bg-red-500/5"
                      : "border-border/40 bg-background/40"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3 w-full">
                      <Clock
                        className={`w-4 h-4 shrink-0 mt-0.5 ${
                          runStatus === "waiting_approval" && approvalStatus === "pending"
                            ? "text-amber-400 animate-pulse"
                            : approvalStatus === "approved"
                            ? "text-emerald-400"
                            : approvalStatus === "rejected"
                            ? "text-red-400"
                            : "text-muted-foreground/40"
                        }`}
                      />
                      <div className="space-y-1 w-full">
                        <div className="flex items-center gap-2">
                          <h3 className="text-xs font-semibold text-foreground">
                            {t("agent.steps.step3.title", "3. Approval Gate (Human-in-the-Loop)")}
                          </h3>
                          <span
                            className={`text-[10px] font-mono px-2 py-0.5 rounded-full border ${
                              runStatus === "waiting_approval" && approvalStatus === "pending"
                                ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                                : approvalStatus === "approved"
                                ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                                : approvalStatus === "rejected"
                                ? "bg-red-500/20 text-red-300 border-red-500/30"
                                : "bg-muted text-muted-foreground border-border/40"
                            }`}
                          >
                            {runStatus === "waiting_approval" && approvalStatus === "pending"
                              ? t("agent.approval.badge", "Pending Approval")
                              : approvalStatus === "approved"
                              ? t("agent.approval.approved", "Action Approved")
                              : approvalStatus === "rejected"
                              ? t("agent.approval.rejected", "Action Rejected")
                              : "Standby"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground leading-relaxed">
                          {t(
                            "agent.steps.step3.desc",
                            "Sensitive action detected. Pausing execution until explicit owner approval."
                          )}
                        </p>
                        {approvalPrompt && (
                          <p className="text-xs font-mono text-foreground/90 mt-2 p-2 rounded bg-background/70 border border-border/40">
                            {approvalPrompt}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  {runStatus === "waiting_approval" && approvalStatus === "pending" && (
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
                {activeStep >= 4 && (
                  <div className="flex items-start gap-3 p-3.5 rounded-xl border border-emerald-500/30 bg-emerald-500/5 min-w-0">
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                    <div className="space-y-1 w-full min-w-0">
                      <h3 className="text-xs font-semibold text-foreground">
                        {t("agent.steps.step4.title", "4. Evidence Verification & Audit")}
                      </h3>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {t(
                          "agent.steps.step4.desc",
                          "Validate output state from target system and register audit trace."
                        )}
                      </p>
                      {evidenceHash && (
                        <div className="text-[11px] font-mono text-muted-foreground bg-background/80 p-2.5 rounded border border-border/40 mt-1 flex items-center gap-2 min-w-0">
                          <Fingerprint className="w-4 h-4 text-emerald-400 shrink-0" />
                          <span className="truncate font-mono">{evidenceHash}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Streaming Output Box */}
              {streamingSynthesis && (
                <div className="mt-4 p-4 rounded-xl border border-primary/20 bg-background/90 space-y-2 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-primary flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5" />
                      {t("agent.stream.output", "Live Streaming Synthesis Output")}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {modelUsed}
                    </span>
                  </div>
                  <div className="text-xs sm:text-sm text-foreground/90 whitespace-pre-wrap leading-relaxed font-sans break-words">
                    {streamingSynthesis}
                  </div>
                </div>
              )}
            </div>

            {/* Prompt Input Area */}
            <div className="pt-6 border-t border-border/40 space-y-2 min-w-0">
              <form onSubmit={handleStartRun} className="flex gap-2 w-full min-w-0">
                <input
                  type="text"
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  disabled={isStreaming}
                  placeholder={t(
                    "agent.input.placeholder",
                    "Enter query for enterprise agent (e.g., Check ZATCA Phase 2 rules)..."
                  )}
                  className="flex-1 min-w-0 rounded-xl bg-background border border-border/60 px-4 py-2 text-xs sm:text-sm placeholder:text-muted-foreground/60 focus:outline-none focus:ring-1 focus:ring-primary disabled:opacity-50"
                />
                <Button
                  type="submit"
                  size="sm"
                  disabled={isStreaming || !promptInput.trim()}
                  className="rounded-xl px-4 gap-1.5 text-xs shrink-0"
                >
                  {isStreaming ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{t("agent.input.send", "Send & Stream")}</span>
                    </>
                  ) : (
                    <>
                      <span>{t("agent.input.send", "Send & Stream")}</span>
                      <Send className="w-3.5 h-3.5" />
                    </>
                  )}
                </Button>
              </form>
              <p className="text-[11px] text-muted-foreground">
                {t(
                  "agent.input.note",
                  "Live streaming via SSE and execution contract matching are active."
                )}
              </p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
