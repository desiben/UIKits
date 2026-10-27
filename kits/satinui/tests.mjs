import assert from 'node:assert/strict';import fs from 'node:fs/promises';import {transform} from 'esbuild';
import {components} from './src/registry.js';import {templates,blocks,agents} from './src/templates.js';import {componentPath,resolveRoute} from './src/routes.js';import {jsxFrom} from './src/code.js';import {stateExamples as extraExamples} from './src/documentation.js';import {motionExamples} from './src/motion.js';import {icons} from 'lucide-react';import {iconName} from './src/interactions.js';
assert.equal(components.length,109);assert.equal(templates.length,10);assert.equal(blocks.length,61);assert.equal(agents.length,6);
assert.equal(new Set(components.map(c=>c.slug)).size,109);
let compiled=0;
for(const c of [...components,...templates,...blocks,...agents,...motionExamples]){const html=typeof c.html==='function'?c.html():c.html;assert.ok(html&&html.length>30,c.name+' is missing content');for(const match of html.matchAll(/data-icon="([^"]+)"/g))assert.ok(icons[iconName(match[1])],c.name+': unknown icon '+match[1]);await transform('const Example=()=> <>'+jsxFrom(html)+'</>',{loader:'jsx'});compiled++;}
for(const es of Object.values(extraExamples))for(const e of es){await transform('const Example=()=> <>'+jsxFrom(e.html)+'</>',{loader:'jsx'});compiled++;}
for(const c of components)assert.equal(resolveRoute(componentPath(c.slug)),c.slug);
for(const file of ['fonts.css','barlow-400.ttf','barlow-500.ttf','barlow-600.ttf','barlow-700.ttf','workspace.webp','product.webp','BARLOW-OFL.txt','LUCIDE-LICENSE.txt']){assert.ok((await fs.stat('dist/assets/'+file)).size>0,file+' empty');}
console.log(`PASS: ${compiled} HTML examples compile to JSX; 109 component routes resolve; 61 blocks, 10 templates and 6 agents have content; required assets exist.`);

assert.equal(new Set(components.map(c=>c.html)).size,109,'Component families must have distinct examples');
assert.equal(new Set(blocks.map(c=>c.html())).size,61,'Blocks must have distinct examples');
assert.equal(Object.keys(extraExamples).length,109,'Each family needs an alternate state/context');
const known=new Set(['introduction','components','templates','blocks','installation','typography','changelog','theming','brand-colors','style-themes','figma-file','showcase','colors','spacing-density','radius-edges','elevation-focus','motion','icons','ai-agents',...components.map(c=>c.slug),...templates.map(c=>'template/'+c.slug),...blocks.map(c=>'block/'+c.slug),...agents.map(c=>'agent/'+c.slug)]);
for(const c of [...components,...templates,...blocks,...agents]){const h=typeof c.html==='function'?c.html():c.html;for(const m of h.matchAll(/href="(?:\/)?#\/([^"?]+)"/g)){assert.ok(known.has(resolveRoute(m[1])),c.name+' links to unknown route '+m[1]);}}
console.log('PASS: all Lucide references resolve; 109 distinct component examples, 61 distinct blocks, 109 alternate examples and all embedded routes validated.');
