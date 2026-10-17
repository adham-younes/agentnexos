/** One scoped production-only content/design acceptance. No model, auth or email calls. */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
const args = process.argv.slice(2);
const commit = args[args.indexOf('--commit') + 1];
if (!args.includes('--commit') || !/^[a-f0-9]{40}$/.test(commit ?? '')) throw Error('Supply the released commit SHA');
const origin = 'https://agynexa.si';
const out = path.resolve('output/content-design', commit);
fs.mkdirSync(out, { recursive: true });
const reportPath = path.join(out, 'acceptance.json');
if (fs.existsSync(reportPath)) throw Error('A production acceptance record already exists for this release');
const routes = ['/', '/platform', '/solutions', ...['knowledge','procurement','receivables','customer-operations'].map(x => '/solutions/' + x), '/services', '/methodology', '/industries', ...['logistics','oil-gas','foreign-trade','energy','trade-distribution','professional-services'].map(x => '/industries/' + x), '/about', '/engagements'];
const captureRoutes = new Set(['/', '/services', '/methodology', '/industries/logistics']);
const result = { origin, commit, started: new Date().toISOString(), checks: [], captures: [], limits: ['Chromium desktop and mobile-size rendering only; this is not Safari, Firefox or a physical-device/network matrix.', 'SEO structure and content rendering are checked; indexing and ranking are not guaranteed.', 'No account, email, database or agent-model calls are made. Existing documented limits remain.'] };
const record = (name, pass, details) => { result.checks.push({ name, status: pass ? 'PASS' : 'FAIL', details }); console.log(JSON.stringify({ name, pass })); };
const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'], ...(proxy ? { proxy: { server: proxy } } : {}) });
const errors = [], failedAssets = [];
try {
  for (const locale of ['en','ar']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, reducedMotion: 'reduce' });
    if (locale === 'ar') await context.addCookies([{ name: 'agynexa_locale', value: 'ar', url: origin, sameSite: 'Lax', secure: true }]);
    const page = await context.newPage();
    page.on('pageerror', e => errors.push({ locale, route: new URL(page.url()).pathname, error: e.message }));
    page.on('response', response => { const u = new URL(response.url()); if (u.origin === origin && response.status() >= 400 && /\.(?:webp|png|svg|woff2?|js|css)$/.test(u.pathname)) failedAssets.push({ path: u.pathname, status: response.status() }); });
    const titles = new Set();
    for (const route of routes) {
      try {
        await page.setViewportSize({ width: 1440, height: 1000 });
        const response = await page.goto(origin + route, { waitUntil: 'networkidle', timeout: 45000 });
        await page.locator('.nexus[data-effects-ready="true"]').waitFor({ state: 'attached', timeout: 15000 });
        await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(image => image.decode().catch(() => {}))); });
        const metadata = await page.evaluate(() => ({ title: document.title, description: document.querySelector('meta[name="description"]')?.content, canonical: document.querySelector('link[rel="canonical"]')?.href, robots: document.querySelector('meta[name="robots"]')?.content, h1: [...document.querySelectorAll('h1')].map(x => x.textContent.trim()), lang: document.documentElement.lang, dir: document.documentElement.dir, pathname: location.pathname, prefixedLinks: [...document.querySelectorAll('a[href]')].map(x => x.getAttribute('href')).filter(x => /^\/(ar|en)(\/|$)/.test(x ?? '')) }));
        const valid = response?.status() === 200 && metadata.pathname === route && metadata.h1.length === 1 && metadata.h1[0].length > 8 && metadata.description?.length > 50 && metadata.title.includes('AGYNEXA') && !titles.has(metadata.title) && metadata.lang.startsWith(locale) && metadata.dir === (locale === 'ar' ? 'rtl' : 'ltr') && metadata.canonical === origin + route && !metadata.robots?.includes('noindex') && !metadata.prefixedLinks.length;
        record(`${locale} ${route} content and metadata`, valid, { status: response?.status(), ...metadata });
        titles.add(metadata.title);
        for (const width of [1440, 390]) {
          await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
          const layout = await page.evaluate(() => ({ width: innerWidth, scrollWidth: document.documentElement.scrollWidth, fontReady: document.fonts.status, heroHeight: document.querySelector('.premium-hero')?.getBoundingClientRect().height, heroButtons: document.querySelectorAll('.premium-hero button').length, schematicSteps: document.querySelectorAll('.premium-schematic-path > li').length, sectorLinks: document.querySelectorAll('.premium-sector-index li a').length, timelineStages: document.querySelectorAll('.editorial-timeline-stage').length, serviceOfferings: document.querySelectorAll('.editorial-service-offering').length }));
          const visible = layout.scrollWidth <= width + 1 && layout.fontReady === 'loaded' && (route !== '/' || (layout.heroButtons === 0 && layout.schematicSteps === 3 && layout.sectorLinks === 6)) && (route !== '/methodology' || layout.timelineStages === 5) && (route !== '/services' || layout.serviceOfferings === 4);
          record(`${locale} ${route} ${width} layout`, visible, layout);
          if (captureRoutes.has(route)) {
            const name = `${locale}-${route === '/' ? 'home' : route.slice(1).replaceAll('/','-')}-${width}.png`;
            await page.screenshot({ path: path.join(out, name), fullPage: true, animations: 'disabled' });
            result.captures.push(name);
          }
        }
      } catch (error) { record(`${locale} ${route} rendering`, false, { error: error.message }); }
    }
    await context.close();
  }
  record('No browser runtime errors', errors.length === 0, errors);
  record('No failed required assets', failedAssets.length === 0, failedAssets);
} catch (error) { record('Acceptance execution', false, { error: error.message }); }
finally {
  await browser.close();
  result.finished = new Date().toISOString();
  result.summary = { passed: result.checks.filter(x => x.status === 'PASS').length, failed: result.checks.filter(x => x.status === 'FAIL').length };
  fs.writeFileSync(reportPath, JSON.stringify(result, null, 2));
  console.log(JSON.stringify({ report: reportPath, ...result.summary }));
  process.exitCode = result.summary.failed ? 1 : 0;
}
