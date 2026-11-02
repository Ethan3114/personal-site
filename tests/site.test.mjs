import assert from 'node:assert/strict';
import { chromium } from 'playwright';

const baseURL = process.env.SITE_URL || 'http://127.0.0.1:8000';
const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const page = await browser.newPage({ reducedMotion: 'reduce' });
const errors = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('response', (response) => {
  if (response.url().startsWith(baseURL) && response.status() >= 400) {
    errors.push(`${response.status()} ${response.url()}`);
  }
});

for (const width of [1440, 1024, 768, 390, 320]) {
  await page.setViewportSize({ width, height: 900 });
  const response = await page.goto(baseURL);
  assert.equal(response.status(), 200);
  await page.locator('.hero-landscape').evaluate(async (element) => {
    const url = getComputedStyle(element).backgroundImage.slice(5, -2);
    const image = new Image();
    image.src = url;
    await image.decode();
    if (image.naturalWidth < 1000) throw new Error('首屏图片分辨率不足');
  });
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth > innerWidth);
  assert.equal(overflow, false, `${width}px 页面横向溢出`);
  const missingAnchors = await page.locator('a[href^="#"]').evaluateAll((links) => links
    .filter((link) => !document.getElementById(link.hash.slice(1)))
    .map((link) => link.hash));
  assert.deepEqual(missingAnchors, []);
  const cardColumns = await page.locator('.explore-grid').evaluate((element) => getComputedStyle(element).gridTemplateColumns.split(' ').length);
  assert.equal(cardColumns, width <= 700 ? 1 : 3);
  const summary = page.locator('#note-curiosity summary');
  await summary.click();
  assert.equal(await page.locator('#note-curiosity').getAttribute('open'), '');
  await summary.press('Enter');
  assert.equal(await page.locator('#note-curiosity').getAttribute('open'), null);
  await page.getByRole('link', { name: '阅读一则思考' }).click();
  await page.waitForFunction(() => document.getElementById('note-curiosity').open);
  await summary.click();
  await page.getByRole('link', { name: '阅读一则思考' }).click();
  await page.waitForFunction(() => document.getElementById('note-curiosity').open);
  if (width <= 700) {
    await page.locator('.menu-toggle').click();
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'true');
    assert.equal(await page.locator('#mobile-nav').isVisible(), true);
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#mobile-nav').isVisible(), false);
    await page.locator('.menu-toggle').click();
    await page.locator('#mobile-nav').getByRole('link', { name: '关于我' }).click();
    assert.equal(await page.locator('#mobile-nav').isVisible(), false);
    assert.equal(new URL(page.url()).hash, '#about');
    await page.locator('.menu-toggle').click();
    await page.setViewportSize({ width: 1000, height: 900 });
    await page.waitForFunction(() => document.querySelector('.menu-toggle').getAttribute('aria-expanded') === 'false');
    assert.equal(await page.locator('.menu-toggle').getAttribute('aria-expanded'), 'false');
  }
  console.log(`通过：${width}px 布局、资源、锚点、随笔与导航`);
}
await page.goto(`${baseURL}/#note-everyday`);
assert.equal(await page.locator('#note-everyday').getAttribute('open'), '');
assert.deepEqual(errors, []);
await browser.close();
console.log('全部真实浏览器检查通过');
