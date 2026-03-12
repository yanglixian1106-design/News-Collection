# News Collection

每日自动新闻简报生成工具

## 功能

- 每天自动搜索国际重要新闻
- 生成 Word 文档 (.docx)
- 自动发送到 Telegram

## 设置

1. 安装依赖: `npm install`

2. 配置 GitHub Secrets:
   - `TELEGRAM_BOT_TOKEN`: 你的 Telegram Bot Token
   - `TELEGRAM_CHAT_ID`: 你的 Chat ID

3. GitHub Actions 会每天自动运行

## 本地测试

```bash
node create-news-doc.js
```
