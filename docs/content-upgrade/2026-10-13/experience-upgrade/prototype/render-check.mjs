import {build} from 'esbuild';
import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
await build({entryPoints:['src/App.tsx'],bundle:true,platform:'node',format:'esm',outfile:'.qa-render.mjs',packages:'external',jsx:'automatic'});
const {App}=await import('./.qa-render.mjs');
const React=await import('react');const {renderToStaticMarkup}=await import('react-dom/server');
const content=JSON.parse(readFileSync('src/content.json','utf8'));
mkdirSync('../verification/rendered-html',{recursive:true});
for(const locale of ['ar','en'])for(const page of content.pages){const html=renderToStaticMarkup(React.createElement(App,{initialRoute:{locale,slug:page.slug}}));writeFileSync(`../verification/rendered-html/${locale}-${page.id.replaceAll('/','-')}.html`,html);}
console.log('Rendered all 42 route/locale combinations for exact content comparison. These are server render checks, not browser screenshots.');
