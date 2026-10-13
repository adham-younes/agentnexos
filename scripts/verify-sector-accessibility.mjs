import assert from "node:assert/strict";
import { chromium } from "@playwright/test";

const baseURL = (process.argv[2] ?? "http://127.0.0.1:4005").replace(/\/$/, "");
const executablePath = process.env.CHROME_BIN;
const browser = await chromium.launch({
  headless: true,
  ...(executablePath ? { executablePath } : {}),
});
let checks = 0;
try {
  for (const locale of ["ar", "en"]) {
    for (const width of [390, 768, 1440]) {
      const page = await browser.newPage({ viewport: { width, height: 900 } });
      try {
        const response = await page.goto(`${baseURL}/${locale}/solutions`, { waitUntil: "domcontentloaded" });
        assert.equal(response?.status(), 200, `${locale}/solutions HTTP status`);
        const tabs = page.locator('.enterprise-sector-nav[role="tablist"][aria-orientation="vertical"] [role="tab"]');
        assert.equal(await tabs.count(), 6, `${locale} sector count`);
        await page.waitForLoadState("networkidle");
        await page.waitForTimeout(250);
        const assertSelected = async (index, reason) => {
          assert.equal(await tabs.nth(index).getAttribute("aria-selected"), "true", `${locale}/${width} ${reason}`);
          assert.equal(await tabs.nth(index).evaluate((el) => document.activeElement === el), true, `${locale}/${width} focus: ${reason}`);
          checks += 2;
        };
        await tabs.nth(0).focus();
        await page.keyboard.press("ArrowDown");
        await assertSelected(1, "ArrowDown");
        await page.keyboard.press("ArrowUp");
        await assertSelected(0, "ArrowUp");
        await page.keyboard.press("ArrowUp");
        await assertSelected(5, "ArrowUp wrap");
        await page.keyboard.press("Home");
        await assertSelected(0, "Home");
        await page.keyboard.press("End");
        await assertSelected(5, "End");
        const href = await page.locator(".enterprise-case-action").getAttribute("href");
        assert.equal(href, `/${locale}/agentnexos?case=delivery`, `${locale}/${width} scoped workflow link`);
        const metrics = await page.evaluate(() => ({
          viewportWidth: window.innerWidth,
          scrollWidth: document.documentElement.scrollWidth,
          lang: document.documentElement.lang,
          dir: document.documentElement.dir,
        }));
        assert.ok(metrics.scrollWidth <= width, `${locale}/${width} horizontal overflow`);
        assert.equal(metrics.dir, locale === "ar" ? "rtl" : "ltr");
        console.log(`PASS ${locale}/solutions ${width}px | tab keyboard, scoped link, layout`);
        checks += 3;
      } finally {
        await page.close();
      }
    }
  }
  console.log(`PASS total ${checks} assertions across six locale/viewport combinations`);
} finally {
  await browser.close();
}
