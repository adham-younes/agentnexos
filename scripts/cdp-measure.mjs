// Viewport-specific measurement. Usage: node scripts/cdp-measure.mjs <url> <width>
const [,, url, w = "390"] = process.argv;
const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
const send = (m, p = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, {res, rej}); ws.send(JSON.stringify({id: mid, method: m, params: p})); });
await new Promise((r) => (ws.onopen = r));
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); } };
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: +w, height: 900, deviceScaleFactor: 1, mobile: true });
await send("Page.navigate", { url });
await new Promise((r) => setTimeout(r, 4500));
const expr = `(() => {
  const box = (el) => { if(!el) return null; const r = el.getBoundingClientRect(); return {w: Math.round(r.width), h: Math.round(r.height), x: Math.round(r.x)}; };
  const vis = (el) => { if(!el) return false; const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width>0 && r.height>0 && cs.display!=='none' && cs.visibility!=='hidden'; };
  const img = (f) => [...document.images].find(i => i.currentSrc.includes(f) || i.src.includes(f));
  const out = { w: window.innerWidth, scrollW: document.documentElement.scrollWidth, overflowX: document.documentElement.scrollWidth > window.innerWidth + 1 };
  for (const f of ['bridge','whale','isolated','shield']) {
    const el = img(f);
    out[f] = el ? { visible: vis(el), ...box(el) } : 'absent';
  }
  const btns = [...document.querySelectorAll('a,button')].filter(e => /Deploy|Book|Sign|شغّل|احجز|تسجيل/.test(e.innerText||''));
  out.ctas = btns.slice(0,4).map(e => ({t:(e.innerText||'').trim().slice(0,24), ...box(e)}));
  const h2s = [...document.querySelectorAll('h2')].slice(0,3).map(e => ({t:(e.innerText||'').trim().slice(0,30), ...box(e), align: getComputedStyle(e).textAlign}));
  out.h2s = h2s;
  return out;
})()`;
const res = await send("Runtime.evaluate", { expression: expr, returnByValue: true });
console.log(JSON.stringify(res.result.value, null, 2));
ws.close();
