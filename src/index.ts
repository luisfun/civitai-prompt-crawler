import { chromium } from "playwright"
import * as fs from "fs"

(async () => {
  const browser = await chromium.launch()
  const page = await browser.newPage()
  await page.goto("https://civitai.com/images")
  const screenshot = await page.screenshot({ path: "example.png" })
  // save dist
  fs.writeFileSync("dist/example.png", screenshot)
  await browser.close()
})()
