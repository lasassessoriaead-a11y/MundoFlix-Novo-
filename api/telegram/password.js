const {API_ID,API_HASH,STATE_SECRET,SESSION_SECRET,requireConfig,seal,open,authHeader,supabase,newClient,json,err}=require("./_common");
module.exports=async(req,res)=>{
  if(req.method!=="POST") return json(res,405,{ok:false,error:"Método inválido"});
  let client;
  try{
    requireConfig(); const auth=authHeader(req);
    const state=open(String(req.body?.authToken||""),STATE_SECRET);
    if(!state.exp || state.exp<Date.now()) throw new Error("A autorização expirou. Comece novamente.");
    const password=String(req.body?.password||"");
    if(!password) throw new Error("Digite a senha de verificação em duas etapas.");
    client=await newClient(state.preSession||"");
    await client.signInWithPassword({apiId:API_ID,apiHash:API_HASH},{password:async()=>password,onError:(e)=>{throw e}});
    const me=await client.getMe();
    const ciphertext=seal(client.session.save(),SESSION_SECRET);
    const display=[me.firstName,me.lastName].filter(Boolean).join(" ")||"Conta Telegram";
    const payload={telegram_user_id:String(me.id),username:me.username||null,display_name:display,session_ciphertext:ciphertext,status:"connected",connected_at:new Date().toISOString()};
    const rows=await supabase("telegram_accounts?on_conflict=owner_user_id,telegram_user_id",{method:"POST",body:JSON.stringify(payload)},auth);
    return json(res,200,{ok:true,account:rows?.[0]||payload});
  }catch(e){return err(res,e)}
  finally{try{if(client) await client.disconnect()}catch{}}
};
