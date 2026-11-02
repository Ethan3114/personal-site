import assert from 'node:assert/strict';
import { mkdir, readFile, writeFile } from 'node:fs/promises';
import { chromium } from 'playwright';

const baseURL = process.env.SITE_URL || 'http://127.0.0.1:8000';
const browser = await chromium.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: true });
const context = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 1, permissions: ['clipboard-read', 'clipboard-write'] });
const page = await context.newPage();
const errors = [];
const resources = [];
const states = [];
page.on('pageerror', (error) => errors.push(error.message));
page.on('response', (response) => {
  resources.push({ url: response.url(), status: response.status() });
  if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
});

async function openApp(id) {
  await page.locator(`.dock-button[data-app="${id}"]`).click();
  await page.locator(`#${id}`).waitFor({ state: 'visible' });
  await page.waitForFunction((id) => Number(getComputedStyle(document.querySelector(`#${id} .window-panel`)).opacity) === 1, id);
}
async function closeApp(id) {
  await page.locator(`#${id} .window-close`).click();
  await page.locator(`#${id}`).waitFor({ state: 'detached' });
}
async function record(name) {
  const state = await page.evaluate(() => ({
    viewport: { width: innerWidth, height: innerHeight, dpr: devicePixelRatio },
    scrollY, canvas: document.querySelectorAll('canvas').length,
    elements: [...document.querySelectorAll('#welcome,#dock,.window-shell,.variable-title span,.dock-button')].map((element) => {
      const r = element.getBoundingClientRect(), s = getComputedStyle(element);
      return { selector: element.id || element.className, rect: [r.x, r.y, r.width, r.height], font: s.fontFamily, fontSize: s.fontSize, axis: s.fontVariationSettings, transform: s.transform, zIndex: s.zIndex };
    }),
  }));
  states.push({ name, ...state });
}

await page.goto(baseURL, { waitUntil: 'networkidle' });
await page.evaluate(() => document.fonts.ready);
assert.match(await page.title(), /Ethan/);
assert.equal(await page.locator('.dock-button').count(), 6);
assert.equal(await page.locator('.desktop-folder').count(), 3);
await record('desktop-rest');
await page.locator('.variable-title').hover({ position: { x: 20, y: 60 } });
await page.waitForTimeout(400);
const weights = await page.locator('.variable-title span').evaluateAll((letters) => letters.map((letter) => getComputedStyle(letter).fontVariationSettings));
assert(new Set(weights).size > 2, '标题逐字字重应随鼠标变化');
await record('pointer-left');
await page.locator('.dock-button').first().hover();
await page.waitForTimeout(350);
const dockTransform = await page.locator('.dock-button').first().evaluate((element) => getComputedStyle(element).transform);
assert.match(dockTransform, /1\.25/);
await record('dock-hover');

await openApp('finder');
assert.equal(await page.locator('.project-file').count(), 6);
await page.locator('.finder-sidebar').getByRole('button', { name: /工具与 Skills/ }).click();
assert.equal(await page.locator('.project-file').count(), 2);
await page.getByRole('textbox', { name: '搜索作品' }).fill('SQLite');
assert.equal(await page.locator('.project-file').count(), 1);
await page.locator('.project-file').click();
assert.equal(await page.locator('.project-detail a').first().getAttribute('href'), 'https://github.com/Ethan3114/wechat-chat-export-skill');
await page.getByRole('button', { name: '返回作品列表' }).click();
await page.getByRole('textbox', { name: '搜索作品' }).fill('不存在的项目');
assert.equal(await page.locator('.empty-search').isVisible(), true);
await page.keyboard.press('Meta+k');
await page.waitForFunction(() => document.activeElement?.getAttribute('aria-label') === '搜索作品');
await page.getByRole('textbox', { name: '搜索作品' }).fill('');
assert.equal(await page.locator('.project-file').count(), 6);
const before = await page.locator('#finder').boundingBox();
await page.mouse.move(before.x + 320, before.y + 22);
await page.mouse.down();
await page.mouse.move(before.x + 365, before.y + 50, { steps: 12 });
await page.mouse.up();
const after = await page.locator('#finder').boundingBox();
assert(after.x - before.x > 35 && after.y - before.y > 20, '窗口应能真实拖动');
await page.waitForTimeout(600);
await openApp('notes');
const finderZ = await page.locator('#finder').evaluate((element) => Number(getComputedStyle(element).zIndex));
const notesZ = await page.locator('#notes').evaluate((element) => Number(getComputedStyle(element).zIndex));
assert(notesZ > finderZ);
assert.equal(await page.locator('.note-row').count(), 3);
await page.locator('.note-row').first().click();
assert.equal(await page.locator('.note-article h3').textContent(), '为好奇心留一扇门');
await page.getByRole('button', { name: '全部随笔' }).click();
await page.getByRole('button', { name: '复制公众号名称' }).click();
assert.equal(await page.evaluate(() => navigator.clipboard.readText()), '江上算峰');
await closeApp('notes');
await closeApp('finder');

await openApp('terminal');
await page.getByRole('textbox', { name: '终端命令' }).fill('about');
await page.getByRole('textbox', { name: '终端命令' }).press('Enter');
assert.match(await page.locator('.terminal-entry').innerText(), /耿江山/);
await page.getByRole('textbox', { name: '终端命令' }).fill('projects');
await page.getByRole('textbox', { name: '终端命令' }).press('Enter');
await page.locator('#finder').waitFor({ state: 'visible' });
await closeApp('finder');
await page.getByRole('textbox', { name: '终端命令' }).fill('clear');
await page.getByRole('textbox', { name: '终端命令' }).press('Enter');
assert.equal(await page.locator('.terminal-entry').count(), 0);
await closeApp('terminal');

await openApp('contact');
assert.match(await page.locator('.contact-content').innerText(), /耿江山/);
await page.locator('.contact-bottom button').click();
assert.equal(await page.evaluate(() => navigator.clipboard.readText()), 'Ethan3114');
await closeApp('contact');

await openApp('gallery');
await page.getByRole('button', { name: '打开日落与远山' }).click();
assert.equal(await page.locator('.gallery-expanded').count(), 1);
await closeApp('gallery');

await openApp('profile');
await page.locator('.react-pdf__Page canvas').waitFor({ state: 'visible', timeout: 20000 });
await page.waitForFunction(() => [...document.querySelectorAll('.textLayer span')].some((element) => element.textContent.includes('耿江山')));
await page.getByRole('button', { name: '放大文档' }).click();
assert.equal(await page.locator('.pdf-tools [aria-live]').textContent(), '125%');
await page.getByRole('button', { name: '缩小文档' }).click();
assert.equal(await page.locator('.pdf-tools [aria-live]').textContent(), '100%');
const downloadEvent = page.waitForEvent('download');
await page.getByRole('link', { name: '下载个人资料 PDF' }).click();
const download = await downloadEvent;
assert.match(download.suggestedFilename(), /个人资料.pdf/);
await record('profile-pdf');
await closeApp('profile');

await page.getByRole('button', { name: '桌面小猫设置' }).click();
await page.getByRole('button', { name: '选择暖棕小猫' }).click();
assert.equal(await page.getByRole('button', { name: '选择暖棕小猫' }).getAttribute('aria-pressed'), 'true');
await page.getByRole('button', { name: '隐藏小猫' }).click();
assert.equal(await page.locator('#oneko').count(), 0);
await page.getByRole('button', { name: '显示小猫' }).click();
await page.getByRole('button', { name: '关闭小猫设置' }).click();
await page.keyboard.type('oneko');
assert.equal(await page.getByRole('dialog', { name: '桌面小猫设置' }).isVisible(), true);
await page.getByRole('button', { name: '关闭小猫设置' }).click();
const petBefore = await page.locator('#oneko').boundingBox();
await page.mouse.move(1100, 700);
await page.waitForTimeout(600);
const petAfter = await page.locator('#oneko').boundingBox();
assert(Math.abs(petAfter.x - petBefore.x) > 15, '宠物应跟随鼠标移动');

for (const width of [1440, 1024, 768, 390, 320]) {
  await page.setViewportSize({ width, height: 900 });
  await page.goto(baseURL, { waitUntil: 'networkidle' });
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth), false, `${width}px 根页面横向溢出`);
  for (const id of ['finder', 'notes', 'gallery', 'contact', 'terminal', 'profile']) {
    await openApp(id);
    const bounds = await page.locator(`#${id}`).boundingBox();
    assert(bounds.x >= -1 && bounds.x + bounds.width <= width + 1, `${width}px ${id} 窗口超出屏幕`);
    if (width < 640) assert.equal(Math.round(bounds.width), width);
    await record(`${width}-${id}`);
    await page.keyboard.press('Escape');
    await page.locator(`#${id}`).waitFor({ state: 'detached' });
  }
  await page.locator('.desktop-folder').first().click();
  assert.equal(await page.locator('.project-file').count(), 2);
  await closeApp('finder');
  console.log(`通过：${width}px 桌面布局、六个应用、分类入口与键盘关闭`);
}
await mkdir('.artifacts/desktop-qa', { recursive: true });
const source = JSON.parse(await readFile('docs/reference-interactions.json', 'utf8'));
await writeFile('.artifacts/desktop-qa/compare-report.json', JSON.stringify({ baseURL, sourceReference: 'https://bysagar.vercel.app/', sourceMotion: source, states, resources, errors, intentionalAdaptations: ['Ethan 真实个人资料与6个公开项目', '自有水彩背景与自制应用图标', '相册使用1幅自有插画', '个人资料PDF来自Ethan公开介绍', '桌面文字使用与浅色背景搭配的深色', '第六个Dock入口为个人资料'], pixelComparison: '未执行截图与像素比对' }, null, 2));
assert.deepEqual(errors, []);
await browser.close();
console.log('真实浏览器功能检查全部通过');
