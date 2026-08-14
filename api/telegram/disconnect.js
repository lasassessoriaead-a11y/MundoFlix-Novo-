const {authHeader,supabase,json,err}=require("./_common");
module.exports=async(req,res)=>{
  if(req.method!=="POST") return json(res,405,{ok:false,error:"Método inválido"});
  try{
    const auth=authHeader(req);
    const id=String(req.body?.id||"");
    if(!id) throw new Error("Conta inválida.");
    await supabase(`telegram_accounts?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",body:JSON.stringify({status:"disconnected"})},auth);
    return json(res,200,{ok:true});
  }catch(e){return err(res,e)}
};
