
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


## プロンプトの取得

```shell
npm run get-prompts
```
