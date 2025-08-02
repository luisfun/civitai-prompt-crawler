
## コードをローカルにコピー、インストール

```shell
cd YOUR_WORKSPACE
git clone https://github.com/luisfun/civitai-prompt-crawler.git
cd civitai-prompt-crawler
npm i
npx playwright install
```

## URLの取得

```shell
npm run get-urls
```

[get-urls](https://github.com/luisfun/civitai-prompt-crawler/blob/main/src/get-urls.ts) の `SCROLL_COUNT` を増やすと取得URLが増える

出力： [dump/urls.json](https://github.com/luisfun/civitai-prompt-crawler/blob/main/dump/urls.json)

## プロンプトの取得

```shell
npm run get-prompts
```

出力： [dump/prompts.json](https://github.com/luisfun/civitai-prompt-crawler/blob/main/dump/prompts.json)

## プロンプトの統合

```shell
npm run merge-prompts
```

出力： [dump/merged-prompts.json](https://github.com/luisfun/civitai-prompt-crawler/blob/main/dump/merged-prompts.json)
