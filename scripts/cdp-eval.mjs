// Minimal CDP client using Node's built-in WebSocket.
// Usage: node scripts/cdp-eval.mjs <url> <path-to-js-expression-file>
const [,, url, exprFile, widthArg = "1440", mobileArg = "false"] = process.argv;
import { readFileSync } from "node:fs";

const expr = readFileSync(exprFile, "utf8");

const list = await (await fetch("http://127.0.0.1:9222/json/new?about:blank", { method: "PUT" })).json().catch(async () => {
  return await (await fetch("http://127.0.0.1:9222/json/list")).json();
});

// pick a page target
const targets = await (await fetch("http://127.0.0.1:9222/json/list")).json();
const page = targets.find((t) => t.type === "page");
if (!page) throw new Error("no page target");

const ws = new WebSocket(page.webSocketDebuggerUrl);
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((resolve, reject) => {
    const mid = ++id;
    pending.set(mid, { resolve, reject });
    ws.send(JSON.stringify({ id: mid, method, params }));
  });

await new Promise((r) => (ws.onopen = r));
ws.onmessage = (ev) => {
  const msg = JSON.parse(ev.data);
  if (msg.id && pending.has(msg.id)) {
    const { resolve, reject } = pending.get(msg.id);
    pending.delete(msg.id);
    msg.error ? reject(new Error(JSON.stringify(msg.error))) : resolve(msg.result);
  }
};

await send("Page.enable");
await send("Runtime.enable");
await send("Emulation.setDeviceMetricsOverride", {
  width: +widthArg, height: 1000, deviceScaleFactor: 1, mobile: mobileArg === "true",
});
await send("Page.navigate", { url });
await new Promise((r) => setTimeout(r, 4000));

const res = await send("Runtime.evaluate", {
  expression: expr,
  returnByValue: true,
  awaitPromise: true,
});
console.log(JSON.stringify(res.result.value, null, 2));
ws.close();
