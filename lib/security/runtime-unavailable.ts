import { NextResponse } from "next/server";

/** Fail closed until identity, tenant authorization and durable state are verified. */
export function runtimeUnavailable() {
  return NextResponse.json(
    { code: "RUNTIME_NOT_READY", error: "The enterprise runtime is unavailable while authentication and durable storage are being verified." },
    { status: 503, headers: { "Cache-Control": "no-store" } },
  );
}
