import { promises as fs } from 'node:fs'
import { chromium } from 'playwright'

;(async () => {
  // dump/urls.jsonからURLリストを取得
  const urls: string[] = JSON.parse(await fs.readFile('dump/urls.json', 'utf-8')) || []
  // 確認済みURLリスト
  const prompts: { url: string; prompt: string; negativePrompt: string }[] =
    JSON.parse(await fs.readFile('dump/prompts.json', 'utf-8')) || []
  const confirmedUrls: string[] = prompts.map(item => item.url)
  // 未確認のURLをフィルタリング
  const crawlUrls = urls.filter(url => !confirmedUrls.includes(url))

  // ブラウザの準備
  const browser = await chromium.launch({ headless: false })
  const page = await browser.newPage()
  // 画像リクエストをブロック
  await page.route('**/*.{png,jpg,jpeg,gif,webp,avif,svg}', route => route.abort())

  // 結果を取得
  const results: { url: string; prompt: string; negativePrompt: string }[] = []
  for (const url of crawlUrls) {
    // 各URLに移動
    await page.goto(url)
    await page.waitForSelector('div.mantine-Card-root')
    await page.waitForTimeout(5000)
    // .mantine-Card-root の2つ目の要素からpromptとnegativePromptを抽出
    const [prompt, negativePrompt] = await page.$$eval('.mantine-Card-root', elements => {
      const card = elements[1] as HTMLElement
      if (!card) return ['', '']
      const promptArea = [card.children[3], card.children[4]]
      return promptArea.map(el => el?.querySelector?.('div.mantine-Text-root')?.textContent || '')
    })
    results.push({ url, prompt, negativePrompt })
  }
  // promptsとresultsを結合、urlが重複しないようにする
  const uniqueResults = Array.from(
    [...prompts, ...results]
      .reduce(
        (map, item) => map.set(item.url, item),
        new Map<string, { url: string; prompt: string; negativePrompt: string }>(),
      )
      .values(),
  )

  await fs.writeFile('dump/prompts.json', JSON.stringify(uniqueResults, null, 2), 'utf-8')
  await browser.close()
})()
