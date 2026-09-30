import { chromium } from "@playwright/test";
import { mkdir, writeFile, readFile } from "node:fs/promises";

const base = new URL(process.argv[2] || process.env.SITE_URL || "http://localhost:3000");
if (!["http:", "https:"].includes(base.protocol) || base.username || base.password) throw Error("Use an HTTP(S) site URL without credentials");
const templateAssets = JSON.parse(await readFile(new URL("../lib/content/template-assets.json", import.meta.url), "utf8"));
const routes = ["", "agentnexos", "platform", "industries", "resources", "solutions", "security", "privacy", "terms", "about", "start"];
const report = { base: base.origin, checkedAt: new Date().toISOString(), pages: [], interactions: [], failures: [], liveAgentVerified: false };
const requireCheck = (condition, message) => { if (!condition) throw Error(message); };
const browser = await chromium.launch();
try {
  for (const locale of ["ar", "en"]) for (const width of [390, 768, 1440]) for (const route of routes) {
    const page = await browser.newPage({ viewport: { width, height: 900 } });
    const errors = []; page.on("pageerror", error => errors.push(error.message));
    const row = { locale, width, route, errors };
    try {
      const response = await page.goto(`${base.origin}/${locale}/${route}`, { waitUntil: "domcontentloaded" });
      await page.locator("main").waitFor();
      await page.evaluate(() => document.fonts.ready);
      await page.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 700) { scrollTo(0, y); await new Promise(resolve => setTimeout(resolve, 35)); } scrollTo(0, 0); });
      for (const image of await page.locator("img").all()) {
        if (!await image.evaluate(element => element.getBoundingClientRect().width > 0 && element.getBoundingClientRect().height > 0 && Number(getComputedStyle(element).opacity) > 0)) continue;
        await image.scrollIntoViewIfNeeded();
        await image.evaluate(element => new Promise((resolve, reject) => { if (element.complete) return resolve(); const timeout = setTimeout(() => reject(Error("Image load timeout")), 15000); const done = () => { clearTimeout(timeout); resolve(); }; element.addEventListener("load", done, { once: true }); element.addEventListener("error", done, { once: true }); }));
      }
      await page.evaluate(() => scrollTo(0, 0));
      await page.waitForFunction(() => [...document.images].filter(image => image.getBoundingClientRect().width > 0 && Number(getComputedStyle(image).opacity) > 0).every(image => image.complete), null, { timeout: 15000 });
      Object.assign(row, await page.evaluate(() => ({
        overflow: document.documentElement.scrollWidth > innerWidth,
        brokenImages: [...document.images].filter(image => image.getBoundingClientRect().width > 0 && Number(getComputedStyle(image).opacity) > 0 && image.naturalWidth === 0).length,
        dir: document.documentElement.dir, lang: document.documentElement.lang, fonts: getComputedStyle(document.body).fontFamily,
        canonical: document.querySelector('link[rel="canonical"]')?.getAttribute("href"),
        mainCount: document.querySelectorAll("main").length,
        images: [...document.images].map(image => ({ src: image.getAttribute("src"), width: image.naturalWidth, height: image.naturalHeight, displayedWidth: image.getBoundingClientRect().width, displayedHeight: image.getBoundingClientRect().height })),
        missingHashTargets: [...document.querySelectorAll('a[href^="#"]')].map(link => link.getAttribute("href")).filter(href => href !== "#" && !document.getElementById(decodeURIComponent(href.slice(1)))),
        missingRoutes: [...document.querySelectorAll('a[href^="/"]')].map(link => link.getAttribute("href").split("#")[0]),
      })));
      row.status = response.status();
      requireCheck(row.status === 200 && !row.overflow && !row.brokenImages && !errors.length, "HTTP/layout/image/browser failure");
      requireCheck(row.dir === (locale === "ar" ? "rtl" : "ltr") && row.lang.startsWith(locale), "Wrong language or direction");
      requireCheck(row.mainCount === 1 && !row.missingHashTargets.length, "Landmark or fragment failure");
      requireCheck(row.canonical?.endsWith(`/${locale}${route ? "/" + route : ""}`), "Wrong canonical");
      const known = new Set(routes.flatMap(path => ["ar", "en"].map(language => `/${language}${path ? "/" + path : ""}`)));
      requireCheck(row.missingRoutes.every(path => known.has(path)), "Unknown internal route");
      if (!route) {
        requireCheck(row.images.length === templateAssets.length && row.images.every((image, index) => image.src === templateAssets[index].src), "Template image source or order changed");
        requireCheck(row.images.every((image, index) => !image.width || (image.width === templateAssets[index].width && image.height === templateAssets[index].height)), "Template image intrinsic dimensions changed");
      }
      delete row.missingRoutes;
    } catch (error) { row.failure = error.message; report.failures.push({ locale, width, route, failure: error.message }); }
    if (process.env.SAVE_SCREENSHOTS === "1") {
      await mkdir("output/release-verification/screenshots", { recursive: true });
      await page.evaluate(() => scrollTo(0, 0));
      await page.screenshot({ path: `output/release-verification/screenshots/${locale}-${route || "home"}-${width}.png`, fullPage: true });
    }
    report.pages.push(row); await page.close();
    if (route === "start") console.log(`Verified ${locale} at ${width}px`);
  }
  for (const locale of ["ar", "en"]) {
    const page = await browser.newPage({ viewport: { width: 390, height: 667 }, reducedMotion: "reduce", acceptDownloads: true });
    try {
      await page.goto(`${base.origin}/${locale}`, { waitUntil: "domcontentloaded" });
      await page.waitForFunction(() => document.querySelector("video")?.paused && document.querySelector("#top h1")?.textContent.trim());
      const toggle = page.locator("#mobile-menu-toggle"), menu = page.locator("#mobile-navigation");
      requireCheck(await menu.evaluate(element => element.inert), "Collapsed menu is not inert");
      await page.keyboard.press("Tab");
      requireCheck(await page.locator(".skip-link").evaluate(element => document.activeElement === element), "Skip link is not first focus target");
      await page.keyboard.press("Enter"); requireCheck(await page.locator("#main-content").evaluate(element => document.activeElement === element), "Skip link does not focus main");
      for (let n = 0; n < 14; n++) { await page.keyboard.press("Tab"); requireCheck(!await menu.evaluate(element => element.contains(document.activeElement)), "Focus enters collapsed menu"); }
      await toggle.click();
      await page.waitForFunction(() => document.querySelector("#mobile-navigation").contains(document.activeElement));
      requireCheck(await page.locator("#main-content").evaluate(element => element.inert), "Background is interactive behind menu");
      for (let n = 0; n < 15; n++) { await page.keyboard.press("Tab"); requireCheck(await page.evaluate(() => document.querySelector("#mobile-navigation").contains(document.activeElement) || document.activeElement.id === "mobile-menu-toggle"), "Focus escaped open menu"); }
      await page.keyboard.press("Escape");
      requireCheck(await toggle.evaluate(element => document.activeElement === element), "Focus did not return to toggle");
      requireCheck(!await page.locator("#main-content").evaluate(element => element.inert), "Background remained inert");
      await page.waitForFunction(() => document.querySelector("video")?.paused);
      const canvasesBefore = await page.locator("canvas").evaluateAll(elements => elements.map(element => element.toDataURL()));
      await page.waitForTimeout(300);
      const canvasesAfter = await page.locator("canvas").evaluateAll(elements => elements.map(element => element.toDataURL()));
      requireCheck(JSON.stringify(canvasesBefore) === JSON.stringify(canvasesAfter), "Decorative canvas animates with reduced motion");
      const securityCard = page.locator('#security [role="button"]').nth(1);
      await securityCard.focus(); await page.keyboard.press("Enter"); requireCheck(await securityCard.getAttribute("aria-pressed") === "true", "Security card keyboard activation failed");
      await toggle.click(); await toggle.click(); requireCheck(await toggle.getAttribute("aria-expanded") === "false", "Pointer close failed");
      await page.goto(`${base.origin}/${locale}/start`);
      await page.locator("button[type=submit]").click(); requireCheck(await page.locator('[aria-invalid="true"]').count() === 7, "Incomplete brief accepted");
      const posts = []; page.on("request", request => { if (request.method() === "POST") posts.push(request.url()); });
      const fields = { goal: "Review purchase requests", owner: "Purchasing manager", trigger: "A new request", source: "Approved records", outcome: "A reviewable draft", acceptance: "Reconcile every item with its source", failure: "Stop and ask the owner" };
      for (const [key, value] of Object.entries(fields)) await page.locator(`#brief-${key}`).fill(value);
      await page.locator("#brief-effect").selectOption("financial"); await page.locator("#brief-volume").fill("100"); await page.locator("#brief-minutes").fill("20");
      await page.locator("button[type=submit]").click();
      const result = page.locator("form section"); await result.waitFor();
      const [download] = await Promise.all([page.waitForEvent("download"), result.locator("button").click()]);
      requireCheck(download.suggestedFilename() === `agentnexos-brief-${locale}.md`, "Brief download failed");
      await page.getByRole("button", { name: locale === "ar" ? "امسح البيانات" : "Clear details", exact: true }).click();
      requireCheck(await page.locator("#brief-goal").inputValue() === "" && !await result.count() && !posts.length, "Brief reset or local-only boundary failed");
      report.interactions.push({ locale, collapsedMenuInert: true, focusContainment: true, escapeFocusReturn: true, pointerClose: true, reducedMotionVideoPaused: true, reducedMotionCanvasStatic: true, skipLink: true, securityCardKeyboard: true, briefValidationDownloadReset: true, briefPostRequests: 0 });
    } catch (error) { report.failures.push({ locale, interaction: error.message }); }
    await page.close();
  }
  const apiPage = await browser.newPage();
  try {
    await apiPage.goto(`${base.origin}/ar/start`, { waitUntil: "domcontentloaded" });
    const result = await apiPage.evaluate(async () => {
      const readiness = await fetch("/api/agentnexos", { signal: AbortSignal.timeout(15000) });
      const checks = [];
      for (const route of ["chat", "approvals", "telemetry"]) {
        const response = await fetch(`/api/${route}`, { method: route === "chat" ? "POST" : "GET", signal: AbortSignal.timeout(10000) });
        checks.push({ route, status: response.status });
      }
      return { readiness: await readiness.json(), checks };
    });
    report.readiness = result.readiness; report.legacy = result.checks;
    for (const check of result.checks) requireCheck(check.status === 503, `Legacy ${check.route} is enabled`);
  } finally { await apiPage.close(); }
} catch (error) { report.failures.push({ global: error.message }); }
finally { await browser.close(); await mkdir("output/release-verification", { recursive: true }); await writeFile("output/release-verification/report.json", JSON.stringify(report, null, 2)); }
console.log(JSON.stringify({ pages: report.pages.length, interactions: report.interactions.length, failures: report.failures, readiness: report.readiness, liveAgentVerified: false }, null, 2));
if (report.failures.length) process.exitCode = 1;
