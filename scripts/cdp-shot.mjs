// Full-page screenshot via CDP. Usage: node scripts/cdp-shot.mjs <url> <out.png> [width] [maxHeight]
import { writeFileSync } from "node:fs";
const [,, url, out, w = "1440", maxH = "14000"] = process.argv;

const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = targets.find((t) => t.type === "page");
const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0; const pending = new Map();
const send = (method, params = {}) => new Promise((res, rej) => { const mid = ++id; pending.set(mid, {res, rej}); ws.send(JSON.stringify({id: mid, method, params})); });
await new Promise((r) => (ws.onopen = r));
ws.onmessage = (ev) => { const m = JSON.parse(ev.data); if (m.id && pending.has(m.id)) { const p = pending.get(m.id); pending.delete(m.id); m.error ? p.rej(new Error(JSON.stringify(m.error))) : p.res(m.result); } };

await send("Page.enable");
await send("Emulation.setDeviceMetricsOverride", { width: +w, height: 1000, deviceScaleFactor: 1, mobile: false });
await send("Page.navigate", { url });
await new Promise((r) => setTimeout(r, 4000));
const hRes = await send("Runtime.evaluate", { expression: "Math.min(document.body.scrollHeight, " + maxH + ")", returnByValue: true });
const fullH = Math.ceil(hRes.result.value);
await send("Emulation.setDeviceMetricsOverride", { width: +w, height: fullH, deviceScaleFactor: 1, mobile: false });
await new Promise((r) => setTimeout(r, 1500));
const shot = await send("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
writeFileSync(out, Buffer.from(shot.data, "base64"));
console.log(out, "height", fullH);
ws.close();
