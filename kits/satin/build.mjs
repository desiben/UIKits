import {build} from 'esbuild';
import fs from 'node:fs/promises';
await fs.mkdir('dist/assets',{recursive:true});
await fs.rm('dist',{recursive:true,force:true});
await fs.cp('public','dist',{recursive:true});
await build({entryPoints:['src/App.jsx'],outfile:'dist/assets/app.js',bundle:true,minify:true,format:'esm',define:{'process.env.NODE_ENV':'"production"'},legalComments:'eof'});
await build({entryPoints:['src/standalone.js'],outfile:'dist/assets/sanoa.js',bundle:true,minify:true,format:'iife',define:{'process.env.NODE_ENV':'"production"'},legalComments:'eof'});
for(const name of ['tokens.css','sanoa.css','docs.css','motion.css'])await fs.copyFile('src/'+name,'dist/assets/'+name);

await fs.writeFile('dist/index.html',`<!doctype html><html lang="en" data-theme="light" data-brand="iris" data-density="comfortable"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="description" content="Satin UI Kit living design system. Interactive Satin UI components, React and HTML examples, themes, blocks and templates."><title>Satin UI Kit — Living design system</title><link rel="icon" type="image/svg+xml" href="/assets/favicon.svg"><link rel="stylesheet" href="/assets/fonts.css"><link rel="stylesheet" href="/assets/tokens.css"><link rel="stylesheet" href="/assets/sanoa.css"><link rel="stylesheet" href="/assets/docs.css"><link rel="stylesheet" href="/assets/motion.css"></head><body><div id="root"></div><script type="module" src="/assets/app.js"></script></body></html>`);
console.log('Built Satin UI Kit documentation and standalone runtime.');
for(const dir of ['react','templates','marketing']){await fs.mkdir('dist/'+dir,{recursive:true});await fs.copyFile('dist/index.html','dist/'+dir+'/index.html');}
