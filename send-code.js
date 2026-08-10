const {Api,API_ID,API_HASH,STATE_SECRET,requireConfig,seal,authHeader,newClient,json,err}=require("./_common");
module.exports=async(req,res)=>{
  if(req.method!=="POST") return json(res,405,{ok:false,error:"Método inválido"});
  let client;
  try{
    requireConfig(); authHeader(req);
    const phone=String(req.body?.phone||"").trim();
    if(!/^\+\d{8,15}$/.test(phone)) throw new Error("Informe o telefone com DDI, por exemplo +55...");
    client=await newClient("");
    const sent=await client.invoke(new Api.auth.SendCode({
      phoneNumber:phone, apiId:API_ID, apiHash:API_HASH,
      settings:new Api.CodeSettings({})
    }));
    const state={
      exp:Date.now()+10*60*1000,
      phone,
      phoneCodeHash:sent.phoneCodeHash,
      preSession:client.session.save()
    };
    return json(res,200,{ok:true,authToken:seal(state,STATE_SECRET),timeout:sent.timeout||null});
  }catch(e){return err(res,e)}
  finally{try{if(client) await client.disconnect()}catch{}}
};
