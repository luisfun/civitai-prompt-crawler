import { promises as fs } from 'node:fs'
import { chromium } from 'playwright'

;(async () => {
  // dump/urls.jsonからURLリストを取得
  const urls: string[] = JSON.parse(await fs.readFile('dump/urls.json', 'utf-8'))
  // ブラウザの準備
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()
  // 画像リクエストをブロック
  await page.route('**/*.{png,jpg,jpeg,gif,webp,avif,svg}', route => route.abort())
  // 結果を取得
  const results: { url: string; prompt: string; negativePrompt: string }[] = []
  for (const url of urls) {
    // 各URLに移動
    await page.goto(url)
    await page.waitForSelector('div.mantine-Card-root')
    await page.waitForTimeout(1000)
    // .mantine-Card-root の2つ目の要素を取得
    const card = await page.$$eval('.mantine-Card-root', elements => elements[1] as HTMLElement)
    console.log(card.children)
    const promptArea = [card.children[3], card.children[4]]
    const texts = promptArea.map(el => el.querySelector('.mantine-Text-root')?.textContent || '')
    results.push({ url, prompt: texts[0], negativePrompt: texts[1] })
  }

  await fs.writeFile('dump/prompts.json', JSON.stringify(results, null, 2), 'utf-8')
  await browser.close()
})()
