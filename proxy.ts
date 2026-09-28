import { NextResponse, type NextRequest } from "next/server";
import { defaultLocale, isLocale } from "@/lib/i18n/config";
export function proxy(request:NextRequest){const first=request.nextUrl.pathname.split("/")[1];if(isLocale(first))return NextResponse.next();const url=request.nextUrl.clone();url.pathname=`/${defaultLocale}${url.pathname==="/"?"":url.pathname}`;return NextResponse.redirect(url);}
export const config={matcher:["/((?!api|_next|.*\\..*).*)"]};
