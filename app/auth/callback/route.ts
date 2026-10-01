import { NextResponse,type NextRequest } from "next/server";
import { authClient } from "@/lib/auth/server";
export async function GET(request:NextRequest) {
 const locale=request.nextUrl.searchParams.get("locale")==="en"?"en":"ar",code=request.nextUrl.searchParams.get("code");
 try {
 const client=await authClient();
 if(code&&client){const {error}=await client.auth.exchangeCodeForSession(code);if(!error)return NextResponse.redirect(new URL(request.nextUrl.searchParams.get("recovery")==="1"?`/${locale}/account?password=reset`:`/${locale}/agentnexos`,request.url));}
 } catch { /* Provider failure must not expose authentication details. */ }
 return NextResponse.redirect(new URL(`/${locale}/login?confirmation=failed`,request.url));
}
