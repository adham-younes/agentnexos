import { authenticatedUser } from '@/lib/auth/server';
import { conversationIdSchema } from '@/lib/workspace/history';
export const dynamic='force-dynamic';
const headers={'Cache-Control':'private, no-store'};
export async function DELETE(request:Request,{params}:{params:Promise<{id:string}>}){
 if(request.headers.get('origin')!==new URL(request.url).origin)return Response.json({code:'ORIGIN_DENIED'},{status:403,headers});
 const auth=await authenticatedUser();if(!auth)return Response.json({code:'AUTH_REQUIRED'},{status:401,headers});
 const {id}=await params;if(!conversationIdSchema.safeParse(id).success)return Response.json({code:'INVALID_REQUEST'},{status:400,headers});
 try{const {data,error}=await auth.client.from('agentnexos_conversations').delete().eq('id',id).eq('user_id',auth.user.id).select('id');if(error)return Response.json({code:'DELETE_FAILED'},{status:503,headers});if(!data?.length)return Response.json({code:'CONVERSATION_UNAVAILABLE'},{status:404,headers});return Response.json({deleted:true},{headers});}catch{return Response.json({code:'DELETE_FAILED'},{status:503,headers});}
}
