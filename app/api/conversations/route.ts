import { authenticatedUser } from '@/lib/auth/server';
import { conversationList } from '@/lib/workspace/history';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store'};
export async function GET(){const auth=await authenticatedUser();if(!auth)return Response.json({code:'AUTH_REQUIRED'},{status:401,headers});try{return Response.json({conversations:await conversationList(auth.client,auth.user.id)},{headers});}catch{return Response.json({code:'HISTORY_UNAVAILABLE'},{status:503,headers});}}
