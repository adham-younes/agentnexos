import { chromium } from "@playwright/test";
import { mkdir, writeFile } from "node:fs/promises";

const base = new URL(process.argv[2] || "http://localhost:3000");
if (!["http:", "https:"].includes(base.protocol) || base.username || base.password) throw Error("Expected an HTTP(S) origin without credentials");
const directory = "output/green-reference";
await mkdir(directory, { recursive: true });
const report = { origin: base.origin, checkedAt: new Date().toISOString(), pages: [], interactions: [], failures: [], liveAuthenticationVerified: false };
const check = (condition, message) => { if (!condition) throw Error(message); };
const browser = await chromium.launch();
try {
  for (const locale of ["ar", "en"]) for (const width of [390, 768, 1440]) for (const route of ["", "agentnexos", "login"]) {
    const page = await browser.newPage({ viewport: { width, height: 900 }, reducedMotion: "reduce" });
    const errors = [];
    page.on("pageerror", error => errors.push(error.message));
    page.on("console", message => { if (message.type() === "error" && /hydrat|Minified React/i.test(message.text())) errors.push(message.text()); });
    const row = { locale, width, route, errors };
    try {
      const response = await page.goto(`${base.origin}/${locale}/${route}`, { waitUntil: "domcontentloaded" });
      await page.locator("h1").waitFor();
      if (route !== "agentnexos") await page.locator('[data-effects-ready="true"]').waitFor();
      await page.evaluate(() => document.fonts.ready);
      if (route === "agentnexos") {
        await page.getByRole("button", { name: locale === "ar" ? "إعادة فحص الاتصال" : "Check connection again" }).waitFor({ timeout: 15000 }).catch(() => {});
        const composer = page.locator("textarea");
        await page.locator(".echo-suggestions button").first().click();
        check((await composer.inputValue()).length > 30, "Suggestion did not populate composer");
        const bounds = await composer.boundingBox();
        check(bounds && bounds.x >= 0 && bounds.x + bounds.width <= width + 1 && bounds.y + bounds.height <= 900, "Composer is not reachable in viewport");
        const reset = page.getByRole("button", { name: locale === "ar" ? "محادثة جديدة" : "New conversation", exact: true });
        await reset.filter({ visible: true }).click();
        check(await composer.inputValue() === "", "New conversation did not reset composer");
        report.interactions.push({ locale, width, workspaceSuggestionAndReset: true, composerInViewport: true });
        await page.reload();
        await page.locator(".echo-welcome h1").waitFor();
        await page.evaluate(() => document.fonts.ready);
      }
      if (route === "login") {
        // Never send even fictional sign-in credentials to a real account service.
        await page.route("**/auth/v1/**", intercepted => intercepted.fulfill({ status: 400, contentType: "application/json", body: JSON.stringify({ error: "invalid_grant", error_description: "Invalid login credentials" }) }));
        await page.locator("#login-email").fill("visual-check@example.invalid");
        await page.locator("#login-password").fill("fictional-visual-check");
        const toggle = page.locator(".login-field button");
        await toggle.click();
        check(await page.locator("#login-password").getAttribute("type") === "text", "Show password failed");
        await toggle.click();
        check(await page.locator("#login-password").getAttribute("type") === "password", "Hide password failed");
        await page.locator("button[type=submit]").click();
        await page.locator('.login-card [role="alert"]').waitFor();
        check(new URL(page.url()).pathname === `/${locale}/login`, "Rejected or unavailable login navigated as success");
        check(await page.locator(`a[href='/${locale}/agentnexos']`).count() === 1, "Public assistant fallback missing");
        report.interactions.push({ locale, width, passwordVisibility: true, honestSignInFailure: true, realAuthRequests: 0 });
        await page.locator("#login-email").clear();
        await page.locator("#login-password").clear();
        await page.reload();
        await page.locator('[data-effects-ready="true"]').waitFor();
        await page.evaluate(() => document.fonts.ready);
      }
      Object.assign(row, await page.evaluate(() => ({ overflow: document.documentElement.scrollWidth > innerWidth, dir: document.documentElement.dir, font: getComputedStyle(document.querySelector("h1")).fontFamily })));
      row.status = response.status();
      check(row.status === 200 && !row.overflow && !errors.length, "HTTP, overflow or browser error");
      check(row.dir === (locale === "ar" ? "rtl" : "ltr"), "Wrong direction");
      row.screenshot = `${directory}/final-${locale}-${route || "home"}-${width}.png`;
      await page.locator("h1").click();
      await page.screenshot({ path: row.screenshot, animations: "disabled", timeout: 60000 });
      if (!route) {
        // Below-fold layout capture, beyond the visual hero.
        await page.locator("#features").scrollIntoViewIfNeeded();
        await page.screenshot({ path: `${directory}/final-${locale}-features-${width}.png`, animations: "disabled", timeout: 60000 });
      }
    } catch (error) { row.failure = error.message; report.failures.push({ locale, width, route, message: error.message }); }
    report.pages.push(row);
    await page.close();
  }
} finally {
  await browser.close();
  await writeFile(`${directory}/report.json`, JSON.stringify(report, null, 2));
}
console.log(JSON.stringify({ pages: report.pages.length, interactions: report.interactions.length, failures: report.failures, liveAuthenticationVerified: false }, null, 2));
if (report.failures.length) process.exitCode = 1;
