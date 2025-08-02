import { promises as fs } from 'node:fs'

const promptCleaner = (prompt: string) =>
  prompt
    .replace(/<.*?>/g, '') // すべての <...> を削除
    .replace('...Show more', '') // "Show more" を削除
    .split(',')
    .map(p => p.trim())
    .filter(p => p.length > 0)

;(async () => {
  // prompts.jsonの読み込み
  const promptsJson: { url: string; prompt: string; negativePrompt: string }[] =
    JSON.parse(await fs.readFile('dump/prompts.json', 'utf-8')) || []
  // promptから不要な要素を削除
  const promptsOnly = promptsJson.map(item => ({
    prompt: promptCleaner(item.prompt),
    negativePrompt: promptCleaner(item.negativePrompt),
  }))
  // マージ
  const merged = promptsOnly.reduce(
    (acc, item) => {
      acc.prompts.push(...item.prompt)
      acc.negativePrompts.push(...item.negativePrompt)
      return acc
    },
    { prompts: [], negativePrompts: [] } as { prompts: string[]; negativePrompts: string[] },
  )
  // 重複削除
  const prompts = Array.from(new Set(merged.prompts)).sort()
  const negativePrompts = Array.from(new Set(merged.negativePrompts)).sort()
  // 結果をファイルに書き込み
  await fs.writeFile('dump/merged-prompts.json', JSON.stringify({ prompts, negativePrompts }, null, 2), 'utf-8')
})()
