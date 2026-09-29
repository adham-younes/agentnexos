import { writeFileSync, mkdirSync } from "node:fs";
import { spawn } from "node:child_process";

mkdirSync("docs/evidence/phase-8", { recursive: true });

async function ensureChrome() {
  const chromeProc = spawn(
    "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    [
      "--headless=new",
      "--remote-debugging-port=9222",
      "--remote-allow-origins=*",
      "--no-first-run",
      "--no-default-browser-check",
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

  const newRes = await fetch("http://127.0.0.1:9222/json/new");
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
      m.error ? p.reject(new Error(JSON.stringify(m.error))) : p.resolve(m.result);
    }
  };

  await send("Page.enable");
  await send("Emulation.setDeviceMetricsOverride", {
    width,
    height,
    deviceScaleFactor: 2,
    mobile: isMobile,
  });

  await send("Page.navigate", { url });
  await new Promise((r) => setTimeout(r, 2000));

  const shot = await send("Page.captureScreenshot", { format: "png" });
  writeFileSync(outPath, Buffer.from(shot.data, "base64"));
  console.log(`Captured ${outPath} (${width}x${height}, mobile=${isMobile})`);

  ws.close();
}

async function main() {
  const chromeProc = await ensureChrome();

  const captures = [
    { url: "http://localhost:3009/ar/solutions", out: "docs/evidence/phase-8/solutions-ar-1440.png", w: 1440, h: 900, m: false },
    { url: "http://localhost:3009/en/solutions", out: "docs/evidence/phase-8/solutions-en-1440.png", w: 1440, h: 900, m: false },
    { url: "http://localhost:3009/ar/solutions", out: "docs/evidence/phase-8/solutions-ar-390.png", w: 390, h: 844, m: true },
    { url: "http://localhost:3009/ar/security", out: "docs/evidence/phase-8/security-ar-1440.png", w: 1440, h: 900, m: false },
    { url: "http://localhost:3009/en/security", out: "docs/evidence/phase-8/security-en-1440.png", w: 1440, h: 900, m: false },
    { url: "http://localhost:3009/ar/security", out: "docs/evidence/phase-8/security-ar-390.png", w: 390, h: 844, m: true },
    { url: "http://localhost:3009/ar/privacy", out: "docs/evidence/phase-8/privacy-ar-1440.png", w: 1440, h: 900, m: false },
    { url: "http://localhost:3009/ar/terms", out: "docs/evidence/phase-8/terms-ar-1440.png", w: 1440, h: 900, m: false },
  ];

  for (const c of captures) {
    await capture(c.url, c.out, c.w, c.h, c.m);
  }

  if (chromeProc) {
    chromeProc.kill("SIGKILL");
  }
}

main().catch((err) => {
  console.error("Main error:", err);
  process.exit(1);
});
