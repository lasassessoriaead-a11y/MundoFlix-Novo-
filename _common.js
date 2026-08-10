const crypto = require("crypto");
const { TelegramClient, Api } = require("telegram");
const { StringSession } = require("telegram/sessions");

const API_ID = Number(process.env.TELEGRAM_API_ID || 0);
const API_HASH = process.env.TELEGRAM_API_HASH || "";
const STATE_SECRET = process.env.TELEGRAM_STATE_SECRET || "";
const SESSION_SECRET = process.env.TELEGRAM_SESSION_SECRET || "";
const SUPABASE_URL = process.env.SUPABASE_URL || "https://ukarfzjlchkgbatwdmua.supabase.co";
const SUPABASE_KEY = process.env.SUPABASE_PUBLISHABLE_KEY || "sb_publishable_881DgYKJPpkQgNP_hy9ZwA_HMqnwlFt";

function requireConfig() {
  if (!API_ID || !API_HASH || !STATE_SECRET || !SESSION_SECRET) {
    const e = new Error("Telegram ainda não configurado no servidor.");
    e.status = 503; throw e;
  }
}
function keyFrom(secret){ return crypto.createHash("sha256").update(secret).digest(); }
function seal(value, secret){
  const iv=crypto.randomBytes(12);
  const cipher=crypto.createCipheriv("aes-256-gcm", keyFrom(secret), iv);
  const enc=Buffer.concat([cipher.update(JSON.stringify(value),"utf8"),cipher.final()]);
  const tag=cipher.getAuthTag();
  return Buffer.concat([iv,tag,enc]).toString("base64url");
}
function open(token, secret){
  const raw=Buffer.from(token,"base64url");
  if(raw.length<29) throw new Error("Token inválido.");
  const iv=raw.subarray(0,12), tag=raw.subarray(12,28), data=raw.subarray(28);
  const decipher=crypto.createDecipheriv("aes-256-gcm", keyFrom(secret), iv);
  decipher.setAuthTag(tag);
  return JSON.parse(Buffer.concat([decipher.update(data),decipher.final()]).toString("utf8"));
}
function authHeader(req){
  const h=req.headers.authorization||"";
  if(!h.startsWith("Bearer ")) { const e=new Error("Sessão do Mundo Flix expirada."); e.status=401; throw e; }
  return h;
}
async function supabase(path, opts, auth){
  const r=await fetch(`${SUPABASE_URL}/rest/v1/${path}`,{
    ...opts,
    headers:{
      apikey:SUPABASE_KEY,
      Authorization:auth,
      "Content-Type":"application/json",
      Prefer:"return=representation,resolution=merge-duplicates",
      ...(opts?.headers||{})
    }
  });
  const text=await r.text();
  if(!r.ok){ const e=new Error(text||"Erro no Supabase"); e.status=r.status; throw e; }
  return text ? JSON.parse(text) : null;
}
async function newClient(session=""){
  const c=new TelegramClient(new StringSession(session),API_ID,API_HASH,{connectionRetries:2,useWSS:true});
  await c.connect();
  return c;
}
function json(res,status,obj){res.status(status).json(obj)}
function err(res,e){
  const msg=(e && (e.errorMessage||e.message)) || "Erro inesperado.";
  const status=e?.status || 400;
  json(res,status,{ok:false,error:msg});
}
module.exports={Api,API_ID,API_HASH,STATE_SECRET,SESSION_SECRET,requireConfig,seal,open,authHeader,supabase,newClient,json,err};
