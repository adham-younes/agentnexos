import { spawn } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

const evidenceDir = path.resolve(process.cwd(), "docs/evidence/phase-9");
fs.mkdirSync(evidenceDir, { recursive: true });

async function launchChrome() {
  const chromeProc = spawn(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    [
      "--headless=new",
      "--remote-debugging-port=9222",
      "--remote-allow-origins=*",
      "--disable-gpu",
      "--no-sandbox",
    ],
    { stdio: "ignore" }
  );

  for (let i = 0; i < 20; i++) {
    await new Promise((r) => setTimeout(r, 200));
    try {
      const res = await fetch("http://127.0.0.1:9222/json/version");
      if (res.ok) return chromeProc;
    } catch {
      // wait
    }
  }

  throw new Error("Failed to connect to headless Chrome on port 9222");
}

async function getWsUrl() {
  const res = await fetch("http://127.0.0.1:9222/json/list");
  const list = await res.json();
  const page = list.find((t) => t.type === "page");
  if (page) return page.webSocketDebuggerUrl;

  const newRes = await fetch("http://127.0.0.1:9222/json/new?about:blank", { method: "PUT" });
  const newTarget = await newRes.json();
  return newTarget.webSocketDebuggerUrl;
}

async function capture(url, outPath, width, height, isMobile = false) {
  const wsUrl = await getWsUrl();
  const ws = new WebSocket(wsUrl);
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
    const m = JSON.parse(ev.data);
    if (m.id && pending.has(m.id)) {
      const p = pending.get(m.id);
      pending.delete(m.id);
      if (m.error) reject(new Error(m.error.message));
      else p.resolve(m.result);
    }
  };

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 1,
    mobile: isMobile,
  });

  await send("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 2200));

  const screenshot = await send("Page.captureScreenshot", {
    format: "png",
    fromSurface: true,
  });

  fs.writeFileSync(outPath, Buffer.from(screenshot.data, "base64"));
  console.log(`[CDP] Saved: ${outPath} (${width}x${height})`);

  ws.close();
}

async function main() {
  const chrome = await launchChrome();
  try {
    const base = "http://localhost:3010";

    const targets = [
      { url: `${base}/ar/agentnexos`, file: "agentnexos-ar-1440.png", w: 1440, h: 900, mobile: false },
      { url: `${base}/ar/agentnexos`, file: "agentnexos-ar-768.png", w: 768, h: 1024, mobile: false },
      { url: `${base}/ar/agentnexos`, file: "agentnexos-ar-390.png", w: 390, h: 844, mobile: true },
      { url: `${base}/en/agentnexos`, file: "agentnexos-en-1440.png", w: 1440, h: 900, mobile: false },
    ];

    for (const t of targets) {
      await capture(t.url, path.join(evidenceDir, t.file), t.w, t.h, t.mobile);
    }

    console.log("Phase 9 visual capture completed successfully.");
  } finally {
    chrome.kill();
  }
}

main().catch((err) => {
  console.error("Capture failed:", err);
  process.exit(1);
});
