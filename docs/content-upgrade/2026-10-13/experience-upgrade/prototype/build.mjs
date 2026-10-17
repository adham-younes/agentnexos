import { build } from 'esbuild';
import { execFileSync } from 'node:child_process';
import { mkdirSync, copyFileSync, cpSync, writeFileSync } from 'node:fs';
mkdirSync('dist',{recursive:true});
await build({entryPoints:['src/main.tsx'],bundle:true,minify:true,outfile:'dist/app.js',jsx:'automatic',define:{'process.env.NODE_ENV':'"production"'}});
execFileSync('node',['node_modules/@tailwindcss/cli/dist/index.mjs','-i','src/styles.css','-o','dist/styles.css','--minify'],{stdio:'inherit'});
cpSync('../assets','dist/assets',{recursive:true,filter:p=>!p.endsWith('master.mp4')});
writeFileSync('dist/index.html','<!doctype html><html lang="ar" dir="rtl"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Agentnexos | Experience reference</title><link rel="stylesheet" href="styles.css"></head><body><div id="root"></div><script src="app.js"></script></body></html>');
console.log('Built the isolated reference prototype; no production API is connected.');
