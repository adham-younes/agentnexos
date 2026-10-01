import { createServerClient } from "@supabase/ssr";
import { NextResponse,type NextRequest } from "next/server";
import { authConfig } from "@/lib/auth/config";

export async function refreshAuth(request:NextRequest) {
 const config=authConfig();let response=NextResponse.next({request});
 if(!config)return response;
 const client=createServerClient(config.url,config.key,{cookies:{getAll:()=>request.cookies.getAll(),setAll(items,cacheHeaders){
  items.forEach(({name,value})=>request.cookies.set(name,value));response=NextResponse.next({request});
  items.forEach(({name,value,options})=>response.cookies.set(name,value,options));
  Object.entries(cacheHeaders||{}).forEach(([key,value])=>response.headers.set(key,value));
 }},global:{fetch:(input,init)=>fetch(input,{...init,signal:AbortSignal.timeout(10000)})}});
 try{await client.auth.getClaims();}catch{/* Protected page/API checks still fail closed. */}
 response.headers.set("Cache-Control","private, no-store");return response;
}
