# Mundo Flix — PWA conectado ao Supabase

Esta versão usa o projeto Supabase real do Mundo Flix para:
- autenticação;
- títulos;
- clientes;
- vendas;
- status de canais e acessos.

## Abrir localmente
Por usar módulos JavaScript e service worker, sirva a pasta em um servidor web; não abra apenas via file://.

## Hospedagem
Pode ser hospedado em qualquer hospedagem estática HTTPS.

## Telegram
A criação real de canais usando a conta pessoal do Telegram exige um serviço separado MTProto/Telethon.
O banco Supabase já está preparado para receber IDs/status dos canais e links de acesso.


## Conexão multi-conta Telegram

Adicione no Vercel, em Project Settings > Environment Variables:

- TELEGRAM_API_ID
- TELEGRAM_API_HASH
- TELEGRAM_STATE_SECRET
- TELEGRAM_SESSION_SECRET
- SUPABASE_URL=https://ukarfzjlchkgbatwdmua.supabase.co
- SUPABASE_PUBLISHABLE_KEY (a publishable key do projeto)

Gere TELEGRAM_STATE_SECRET e TELEGRAM_SESSION_SECRET como duas strings aleatórias longas e diferentes.

O telefone, código e senha de 2FA não são persistidos. O estado temporário de login é devolvido ao navegador em um token criptografado e mantido apenas em memória durante o fluxo. A sessão final do Telegram é criptografada no servidor antes de ser armazenada no Supabase.
