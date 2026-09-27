// Ask Chrome which physical font actually renders a node. Usage: node scripts/cdp-fonts.mjs <url> <cssSelector>
const [,, url, selector] = process.argv;
const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
const send = (m, p = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, {res, rej}); ws.send(JSON.stringify({id: mid, method: m, params: p})); });
await new Promise((r) => (ws.onopen = r));
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); } };

await send("DOM.enable");
await send("CSS.enable");
await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: 1440, height: 1000, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url });
await new Promise((r) => setTimeout(r, 4500));

const doc = await send("DOM.getDocument", { depth: -1 });
const node = await send("DOM.querySelector", { nodeId: doc.root.nodeId, selector });
if (!node.nodeId) { console.log("selector not found:", selector); ws.close(); process.exit(0); }

const fonts = await send("CSS.getPlatformFontsForNode", { nodeId: node.nodeId });

// also computed family + whether arabic webfont face is loaded
const evalRes = await send("Runtime.evaluate", {
  expression: `(() => {
    const el = document.querySelector(${JSON.stringify(selector)});
    const cs = getComputedStyle(el);
    return {
      text: (el.innerText||'').slice(0,60),
      fontFamily: cs.fontFamily,
      fontSize: cs.fontSize,
      direction: cs.direction,
      arabicVar: cs.getPropertyValue('--font-arabic').trim(),
      loadedPlexArabic: document.fonts ? [...document.fonts].some(f => /Plex/i.test(f.family)) : null,
      fontFaces: document.fonts ? [...document.fonts].map(f => f.family + ' ' + f.status) : [],
    };
  })()`, returnByValue: true,
});
console.log(JSON.stringify({ platformFonts: fonts.fonts, ...evalRes.result.value }, null, 2));
ws.close();
