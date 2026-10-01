const project='ruereqpvykwnakcnmxha';
export function authConfigStatus(){
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL||process.env.AGENTNEXOS_SUPABASE_URL;
 const key=process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url)return 'AUTH_URL_MISSING';if(!key)return 'AUTH_PUBLIC_KEY_MISSING';
 try{const parsed=new URL(url);if(parsed.origin!==`https://${project}.supabase.co`||parsed.username||parsed.password)return 'AUTH_PROJECT_MISMATCH';}catch{return 'AUTH_URL_INVALID';}
 if(key.startsWith('sb_publishable_')&&key.length>=30)return 'AUTH_CONFIGURED';
 try{const payload=JSON.parse(Buffer.from(key.split('.')[1]||'','base64url').toString());if(key.split('.').length===3&&payload.role==='anon'&&payload.ref===project)return 'AUTH_CONFIGURED';}catch{/* Invalid public-key format. */}
 return 'AUTH_PUBLIC_KEY_INVALID';
}
export function authConfig(){
 if(authConfigStatus()!=='AUTH_CONFIGURED')return null;
 return {url:new URL(process.env.NEXT_PUBLIC_SUPABASE_URL||process.env.AGENTNEXOS_SUPABASE_URL!).origin,key:(process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)!};
}
