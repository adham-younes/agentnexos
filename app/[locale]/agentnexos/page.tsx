import { revisionMetadata } from "@/lib/content/revision";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "@/lib/i18n/config";
import { AgentWorkspace } from "@/components/agent/workspace";
export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params; if (!isLocale(locale)) notFound();
  return revisionMetadata("agentnexos", locale);
}
export default function AgentSpacePage() { return <AgentWorkspace />; }
