import { chromium, type Page } from 'playwright'
import { promises as fs } from 'fs'
import { join } from 'path'

const SCROLL_COUNT = 0

const getHref = (page: Page) =>
  page.$$eval('a.mantine-Anchor-root', elements => elements.map(el => (el as HTMLAnchorElement).href))

;(async () => {
  // ブラウザの準備
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()
  // 画像リクエストをブロック
  await page.route('**/*.{png,jpg,jpeg,gif,webp,avif,svg}', route => route.abort())
  // メインページへ移動
  await page.goto('https://civitai.com/images')
  await page.waitForSelector('a.mantine-Anchor-root')
  await page.waitForTimeout(1000)
  // hrefの取得
  const hrefs = await getHref(page)
  for (let i = 0; i < SCROLL_COUNT; i++) {
    await page.evaluate(() => {
      const scrollArea = document.querySelector('div.scroll-area')
      if (scrollArea) {
        scrollArea.scrollTo(0, scrollArea.scrollHeight)
      }
    })
    await page.waitForTimeout(5000)
    hrefs.push(...(await getHref(page)))
  }
  // 重複を削除
  const uniqueHrefs = Array.from(new Set(hrefs))
  console.log(uniqueHrefs)
  // dump/urls.json に保存
  const dumpDir = join(__dirname, '..', 'dump')
  await fs.mkdir(dumpDir, { recursive: true })
  await fs.writeFile(join(dumpDir, 'urls.json'), JSON.stringify(uniqueHrefs, null, 2), 'utf-8')
  await browser.close()
})()
