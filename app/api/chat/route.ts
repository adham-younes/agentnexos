import { runtimeUnavailable } from "@/lib/security/runtime-unavailable";

export const dynamic = "force-dynamic";

export function POST() {
  return runtimeUnavailable();
}
