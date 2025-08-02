import { chromium } from 'playwright'

;(async () => {
  // ブラウザの準備
  const browser = await chromium.launch()
  const page = await browser.newPage()
  // メインページへ移動
  await page.goto('https://civitai.com/images')
  await page.waitForSelector('a.mantine-Anchor-root')
  for (let i = 0; i < 3; i++) {
    await page.evaluate(() => {
      window.scrollTo(0, document.body.scrollHeight)
    })
    await page.waitForTimeout(500)
  }
  const hrefs = await page.$$eval('a.mantine-Anchor-root', elements =>
    elements.map(el => (el as HTMLAnchorElement).href),
  )
  console.log(hrefs)
  await browser.close()
})()
