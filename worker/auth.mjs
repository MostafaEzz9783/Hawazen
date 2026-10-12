const encoder = new TextEncoder();
const attempts = new Map();
const COOKIE = 'hawazen_session';
const headers = {'Cache-Control':'no-store, private','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin','X-Frame-Options':'SAMEORIGIN'};
const json = (body,status=200,extra={})=>new Response(JSON.stringify(body),{status,headers:{...headers,'Content-Type':'application/json',...extra}});
async function equal(a,b){const x=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(a))),y=new Uint8Array(await crypto.subtle.digest('SHA-256',encoder.encode(b)));let diff=0;for(let i=0;i<x.length;i++)diff|=x[i]^y[i];return diff===0;}
async function sign(value,secret){const key=await crypto.subtle.importKey('raw',encoder.encode(secret),{name:'HMAC',hash:'SHA-256'},false,['sign']);const bytes=new Uint8Array(await crypto.subtle.sign('HMAC',key,encoder.encode(value)));return Array.from(bytes,b=>b.toString(16).padStart(2,'0')).join('');}
async function authorized(request,env){const token=(request.headers.get('Cookie')||'').split(';').map(v=>v.trim()).find(v=>v.startsWith(COOKIE+'='))?.slice(COOKIE.length+1);if(!token)return false;const [expiry,nonce,signature,...rest]=token.split('.');if(rest.length||!/^\d+$/.test(expiry||'')||!nonce||!signature||Number(expiry)<=Date.now())return false;return equal(signature,await sign(expiry+'.'+nonce,env.SESSION_SECRET));}
const cookie=(value,maxAge)=>`${COOKIE}=${value}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${maxAge}`;

export function createWorker(assets,loginHTML){return {async fetch(request,env){
 const url=new URL(request.url);
 if(!env.AUTH_USERNAME||!env.AUTH_PASSWORD||!env.SESSION_SECRET)return new Response('Service configuration unavailable',{status:503,headers});
 if(url.pathname==='/auth/login'&&request.method==='POST'){
  if(request.headers.get('Origin')!==url.origin)return json({error:'Invalid origin'},403);
  const ip=request.headers.get('CF-Connecting-IP')||'local',now=Date.now();
  for(const [key,value] of attempts)if(now-value.start>900000)attempts.delete(key);
  const record=attempts.get(ip)||{count:0,start:now};
  if(record.count>=5)return json({error:'Too many attempts. Try again later.'},429,{'Retry-After':String(Math.ceil((900000-(now-record.start))/1000))});
  let input;try{if(Number(request.headers.get('Content-Length'))>2048)return json({error:'Invalid input'},400);input=await request.json();}catch{return json({error:'Invalid input'},400);}
  const username=String(input.username||''),password=String(input.password||'');
  const okUser=await equal(username,env.AUTH_USERNAME),okPassword=await equal(password,env.AUTH_PASSWORD);
  if(!okUser||!okPassword){record.count++;attempts.set(ip,record);return json({error:'Invalid username or password'},401);}
  attempts.delete(ip);
  const payload=String(now+28800000)+'.'+crypto.randomUUID();
  return json({ok:true},200,{'Set-Cookie':cookie(payload+'.'+await sign(payload,env.SESSION_SECRET),28800)});
 }
 if(url.pathname==='/auth/logout'&&request.method==='POST'){
  if(request.headers.get('Origin')!==url.origin)return json({error:'Invalid origin'},403);
  return json({ok:true},200,{'Set-Cookie':cookie('',0)});
 }
 const allowed=await authorized(request,env);
 if(url.pathname==='/login')return allowed?Response.redirect(url.origin+'/',303):new Response(loginHTML,{headers:{...headers,'Content-Type':'text/html; charset=utf-8'}});
 const publicAsset=['/madinum-logo.jpeg','/fonts/din.ttf','/fonts/noor.ttf'].includes(url.pathname);
 if(!allowed&&!publicAsset){if(url.pathname==='/'||request.headers.get('Accept')?.includes('text/html'))return Response.redirect(url.origin+'/login',303);return json({error:'Authentication required'},401);}
 if(request.method!=='GET'&&request.method!=='HEAD')return json({error:'Method not allowed'},405);
 const asset=assets[url.pathname];
 if(!asset)return new Response('Not found',{status:404,headers});
 const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
 return new Response(request.method==='HEAD'?null:bytes,{headers:{...headers,'Content-Type':asset.type}});
}};}
