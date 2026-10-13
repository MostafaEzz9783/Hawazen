export function createSite(assets){return {async fetch(request){
 const url=new URL(request.url);
 if(url.pathname==='/login')return Response.redirect(url.origin+'/',303);
 if(request.method!=='GET'&&request.method!=='HEAD')return new Response('Method not allowed',{status:405});
 const asset=assets[url.pathname];
 if(!asset)return new Response('Not found',{status:404});
 const bytes=Uint8Array.from(atob(asset.data),c=>c.charCodeAt(0));
 return new Response(request.method==='HEAD'?null:bytes,{headers:{'Content-Type':asset.type,'Cache-Control':'no-store','X-Content-Type-Options':'nosniff','Referrer-Policy':'same-origin'}});
}};}
