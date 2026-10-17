/** One production-only acceptance sweep. No local/preview target or email/model call. */
import fs from 'node:fs';
import path from 'node:path';
import { chromium } from '@playwright/test';
const args = process.argv.slice(2);
const commit = args[args.indexOf('--commit') + 1];
if (!args.includes('--commit') || !/^[a-f0-9]{40}$/.test(commit ?? '')) throw Error('Supply released 40-character --commit SHA');
const origin = 'https://agynexa.si';
const dir = path.resolve('output/premium-platform', commit);
fs.mkdirSync(dir, { recursive: true });
const reportPath = path.join(dir, 'public-acceptance.json');
if (fs.existsSync(reportPath)) throw Error('This released commit already has a public acceptance record; review it instead of repeating.');
const routes = ['/', '/platform', '/solutions', '/solutions/knowledge', '/solutions/procurement', '/solutions/receivables', '/solutions/customer-operations', '/services', '/methodology', '/industries', ...['logistics','oil-gas','foreign-trade','energy','trade-distribution','professional-services'].map(x => '/industries/' + x), '/engagements', '/resources', '/about', '/start', '/privacy', '/terms', '/security', '/login', '/agentnexos'];
const result = { origin, commit, started: new Date().toISOString(), checks: [], screenshots: [], limits: ['This sweep verifies public rendering/navigation, metadata, required assets and visible controls. Account data isolation and real model behavior have separate results in the same release acceptance wave.', 'Email delivery and access from every external network cannot be inferred from these checks.'] };
const record = (name, pass, details) => { result.checks.push({ name, status: pass ? 'PASS' : 'FAIL', details }); console.log(JSON.stringify({ name, pass })); };
const proxy = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
const browser = await chromium.launch({ executablePath: '/usr/bin/chromium', headless: true, args: ['--no-sandbox'], ...(proxy ? { proxy: { server: proxy } } : {}) });
const links = new Set(), errors = [], assetFailures = [];
try {
  for (const locale of ['en','ar']) {
    const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, locale: 'ar-EG', permissions: ['clipboard-read','clipboard-write'] });
    if (locale === 'ar') await context.addCookies([{ name: 'agynexa_locale', value: 'ar', url: origin, sameSite: 'Lax', secure: true }]);
    const page = await context.newPage();
    page.on('pageerror', e => errors.push({ locale, path: new URL(page.url()).pathname, error: e.message }));
    page.on('response', response => { const u = new URL(response.url()); if (u.origin === origin && response.status() >= 400 && /\.(?:webp|png|svg|woff2?|js|css)(?:$|\?)/i.test(u.pathname)) assetFailures.push({ url: u.pathname, status: response.status() }); });
    for (const route of routes) {
      for (const width of [1440,390]) {
        await page.setViewportSize({ width, height: width === 390 ? 844 : 1000 });
        let response;
        try {
          response = await page.goto(origin + route, { waitUntil: 'networkidle', timeout: 45000 });
          await page.evaluate(async () => { await document.fonts.ready; await Promise.all([...document.images].map(i => i.decode().catch(() => {}))); });
          const data = await page.evaluate(() => ({
            title: document.title, robots: document.querySelector('meta[name=robots]')?.content, pathname: location.pathname, lang: document.documentElement.lang, dir: document.documentElement.dir,
            h1: document.querySelector('h1')?.textContent?.trim(), overflow: document.documentElement.scrollWidth > innerWidth + 1,
            canonical: document.querySelector('link[rel="canonical"]')?.href,
            alternates: [...document.querySelectorAll('link[hreflang]')].map(e => ({lang:e.hreflang,url:e.href})),
            imageErrors: [...document.images].filter(i => !i.complete || !i.naturalWidth).map(i => i.getAttribute('src')),
            links: [...document.querySelectorAll('a[href]')].map(a => a.getAttribute('href')),
            body: document.body.innerText.slice(0,180), font: getComputedStyle(document.body).fontFamily,
          }));
          for (const link of data.links) if (link?.startsWith('/') && !link.startsWith('//') && !link.includes('#')) links.add(link.split('?')[0]);
          const prefixLinks = data.links.filter(x => /^\/(?:ar|en)(?:[/?#]|$)/.test(x ?? ''));
          const canonicalExpected = origin + (route === '/' ? '/' : route);
          const headers = response?.headers() ?? {};
          const privateHtml = /private/.test(headers['cache-control'] ?? '') && /no-store/.test(headers['cache-control'] ?? '') && headers['content-language'] === locale;
          const privateSeo = !['/login','/agentnexos'].includes(route) || /noindex/.test(data.robots ?? '');
          const pass = privateHtml && privateSeo && /AGYNEXA/.test(data.title) && response?.status() === 200 && data.pathname === route && Boolean(data.h1) && data.dir === (locale === 'ar' ? 'rtl':'ltr') && data.lang.startsWith(locale) && !data.overflow && !data.imageErrors.length && !prefixLinks.length && data.canonical === canonicalExpected && data.alternates.every(a => a.lang !== 'ar' && !/^https:\/\/agynexa.si\/(ar|en)(\/|$)/.test(a.url));
          record(`${locale} ${route} ${width}`, pass, { status: response?.status(), cache: headers['cache-control'], vary: headers.vary, contentLanguage: headers['content-language'], ...data, links: undefined, prefixLinks });
          const filename = `${locale}-${route === '/' ? 'home' : route.slice(1).replaceAll('/','-')}-${width}.png`;
          await page.screenshot({ path: path.join(dir,filename), fullPage: true });
          result.screenshots.push(filename);
        } catch (e) { record(`${locale} ${route} ${width}`, false, { error: e.message }); }
      }
    }
    if (locale === 'en') {
      await page.goto(origin + '/platform?reference=language#main-content', { waitUntil: 'networkidle' });
      const toggle = page.getByRole('button', { name: 'التبديل إلى العربية', exact: true }).first();
      if (await toggle.count()) {
        await toggle.click(); await page.waitForFunction(() => document.documentElement.dir === 'rtl' && document.documentElement.lang.startsWith('ar'));
        const preference = (await context.cookies(origin)).find(c => c.name === 'agynexa_locale');
        record('language toggle preserves clean URL, query and hash', page.url() === origin + '/platform?reference=language#main-content' && await page.locator('html').getAttribute('dir') === 'rtl' && preference?.value === 'ar' && preference?.secure && preference?.sameSite === 'Lax' && preference?.path === '/', { url: page.url(), preference: preference ? { value: preference.value, secure:preference.secure, sameSite:preference.sameSite, path:preference.path } : null });
      } else record('language toggle available', false, { buttons: await page.getByRole('button').allTextContents() });
    }
    await context.close();
  }
  const context = await browser.newContext();
  const legacy = await context.request.get(origin + '/ar/industries/energy?source=legacy', { maxRedirects:0 });
  record('legacy locale URL redirects with preference and query', legacy.status() === 307 && new URL(legacy.headers().location ?? '/', origin).href === origin + '/industries/energy?source=legacy' && /agynexa_locale=ar/.test(legacy.headers()['set-cookie'] ?? ''), { status: legacy.status(), location: legacy.headers().location });
  for (const endpoint of ['/robots.txt','/sitemap.xml','/og','/favicon.ico']) {
    const response = await context.request.get(origin + endpoint);
    const body = await response.body();
    const text = endpoint.endsWith('.xml') || endpoint.endsWith('.txt') ? body.toString() : '';
    const sane = endpoint !== '/sitemap.xml' || (!/<loc>[^<]*\/(?:ar|en)(?:\/|<)/.test(text) && !text.includes('/login<') && !text.includes('/agentnexos<') && ['logistics','oil-gas','foreign-trade','energy','trade-distribution','professional-services'].every(slug => text.includes('/industries/' + slug)));
    record(endpoint, response.status() === 200 && sane, { status: response.status(), bytes:body.length });
  }
  for (const link of [...links].filter(x => !routes.includes(x) && !x.startsWith('/auth/') && !x.startsWith('/api/'))) {
    const response = await context.request.get(origin + link);
    record('linked resource ' + link, response.status() < 400, { status:response.status(), bytes:(await response.body()).length });
  }
  for (const endpoint of ['/api/chat','/api/approvals','/api/telemetry']) {
    const response = await context.request.post(origin + endpoint, { headers:{Origin:origin}, data:{} });
    record('inactive endpoint remains closed ' + endpoint, [403,404,405,410,503].includes(response.status()), {status:response.status()});
  }
  await context.close();
  record('no browser runtime errors', !errors.length, { errors });
  record('no failed required images/styles/scripts/fonts', !assetFailures.length, { failures:assetFailures });
} catch (error) { record('verification execution', false, { error:error.message }); }
finally {
  await browser.close();
  result.finished = new Date().toISOString();
  result.summary = { passed:result.checks.filter(x => x.status === 'PASS').length, failed:result.checks.filter(x => x.status === 'FAIL').length };
  fs.writeFileSync(reportPath,JSON.stringify(result,null,2));
  console.log(JSON.stringify({ report:reportPath,...result.summary }));
  process.exitCode = result.summary.failed ? 1 : 0;
}
