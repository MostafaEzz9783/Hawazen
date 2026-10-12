import http from 'node:http';
import worker from '../dist/server/index.js';
let input='';process.stdin.setEncoding('utf8');
process.stdin.on('data',chunk=>{input+=chunk;if(!input.includes('\n'))return;const env=JSON.parse(input);process.stdin.removeAllListeners('data');input='';
const server=http.createServer(async(req,res)=>{try{const chunks=[];for await(const chunk of req)chunks.push(chunk);const body=Buffer.concat(chunks);const request=new Request('http://127.0.0.1:5173'+req.url,{method:req.method,headers:req.headers,...(body.length?{body}: {})});const response=await worker.fetch(request,env);res.writeHead(response.status,Object.fromEntries(response.headers));res.end(Buffer.from(await response.arrayBuffer()));}catch{res.writeHead(500);res.end('Preview error');}});server.listen(5173,'127.0.0.1',()=>console.log('Authenticated preview: http://127.0.0.1:5173'));});
console.log('Waiting for preview environment on stdin.');
