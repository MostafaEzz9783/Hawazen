import fs from 'node:fs/promises';
import path from 'node:path';
const assets={};
const types={'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css; charset=utf-8','.ttf':'font/ttf','.jpeg':'image/jpeg','.png':'image/png','.svg':'image/svg+xml'};
async function walk(dir){for(const item of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,item.name);if(item.isDirectory())await walk(file);else{const key='/'+path.relative('dist',file).split(path.sep).join('/');assets[key]={type:types[path.extname(file)]||'application/octet-stream',data:(await fs.readFile(file)).toString('base64')};}}}
await walk('dist');assets['/']=assets['/index.html'];
const server=await fs.readFile('worker/site.mjs','utf8');
if(path.resolve('dist')!==path.join(process.cwd(),'dist'))throw new Error('Unexpected output directory');
await fs.rm('dist',{recursive:true,force:true});
await fs.mkdir('dist/server',{recursive:true});await fs.mkdir('dist/.openai',{recursive:true});
await fs.writeFile('dist/server/index.js',server+'\nexport default createSite('+JSON.stringify(assets)+');\n');
await fs.copyFile('.openai/hosting.json','dist/.openai/hosting.json');
console.log('Built dashboard Worker without login.');
