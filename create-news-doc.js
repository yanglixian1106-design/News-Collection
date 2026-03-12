const { Document, Packer, Paragraph, TextRun, HeadingLevel, AlignmentType } = require('docx');
const fs = require('fs');
const { exec } = require('child_process');

// Telegram 配置 from environment variables
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8653393135:AAHkLk94Fi3C2EaIhNbMZ2CSjHDPVCgx7Pk';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '8018327859';

// Get current date in YYYYMMDD format
const now = new Date();
const year = now.getFullYear();
const month = String(now.getMonth() + 1).padStart(2, '0');
const day = String(now.getDate()).padStart(2, '0');
const dateStr = `${year}${month}${day}`;

// Format date for display (e.g., "2026年3月12日")
const displayDate = `${year}年${parseInt(month)}月${parseInt(day)}日`;

const fileName = `${dateStr}每日简报.docx`;
const outputDir = 'Word Daily News';
const outputPath = `${outputDir}/${fileName}`;

// News data from March 12, 2026
const newsItems = [
  {
    title: "联合国安理会通过决议强烈谴责伊朗，中俄弃权",
    summary: "联合国安理会以13票赞成、2票弃权的表决结果通过决议草案，最强烈地谴责伊朗针对海湾邻国的袭击，要求伊朗立即停止此类袭击并确保商船航行自由。中国和俄罗斯投了弃权票。",
    source: "https://news.un.org/zh/story/2026/03/1141769"
  },
  {
    title: "法国总统马克龙：霍尔木兹海峡已成\"战场\"",
    summary: "法国总统马克龙当地时间11日在爱丽舍宫表示，当前霍尔木兹海峡已成为\"战场\"，七国集团当天举行会议讨论保障航行自由和海上安全的相关机制。",
    source: "https://news.sina.com.cn/w/2026-03-12/doc-inhqrvzf9111873.shtml"
  },
  {
    title: "美军在12天决定性军事行动中打击伊朗境内逾5500个目标",
    summary: "美国军方表示，已使用多种精确制导武器打击了伊朗境内5500多个目标，其中包括60多艘舰船。伊朗发射的导弹在霍尔木兹海峡击中了至少三艘船只。",
    source: "https://www.voachinese.com/a/us-military-strikes-over-5500-targets-inside-iran-after-12-days-of-decisive-operations-against-regime-20260311/8123825.html"
  },
  {
    title: "伊朗总统提出结束战争三大必要条件",
    summary: "伊朗总统佩泽希齐扬表示，结束当前由美国和以色列挑起的战争的\"唯一途径\"是：承认伊朗的合法权利、支付战争赔偿、由国际社会提供防止未来侵略行为的坚定保障。",
    source: "https://www.news.cn/world/20260312/e138372b0eff48ffbcd9010693785a07/c.html"
  },
  {
    title: "阿盟紧急召开会议，22国外长严厉谴责伊朗袭击",
    summary: "阿拉伯国家联盟紧急召集全体成员，就伊朗近期发动的大规模袭击展开磋商。22个成员国首次在重大安全威胁面前启动集体防御机制，统一协调应对这场区域危机。",
    source: "https://m.163.com/dy/article/KNO665DF05568329.html"
  },
  {
    title: "G7发表联合声明：将采取必要措施",
    summary: "七国集团(G7)发表联合声明，讨论保障航行自由和海上安全的相关机制，应对霍尔木兹海峡航运受阻对全球能源贸易的影响。",
    source: "https://www.163.com/dy/article/KNP5FGF805561G0D.html"
  },
  {
    title: "欧洲面临比2022年更严重的能源危机",
    summary: "中东军事冲突导致霍尔木兹海峡航运受阻，油气价格飙升，欧洲面临新一轮能源危机。欧盟天然气库存已低于历史同期水平，欧盟领导人担忧持久冲突将重创欧洲经济。",
    source: "https://news.sina.com.cn/zx/ds/2026-03-11/doc-inhqqcrw5836672.shtml"
  }
];

// Create the document
const doc = new Document({
  sections: [{
    properties: {},
    children: [
      // Title
      new Paragraph({
        text: `${dateStr}每日简报`,
        heading: HeadingLevel.TITLE,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 200,
        },
      }),
      // Date
      new Paragraph({
        text: displayDate,
        alignment: AlignmentType.CENTER,
        spacing: {
          after: 400,
        },
      }),
      // News items
      ...newsItems.map((news, index) => [
        new Paragraph({
          text: `${index + 1}. ${news.title}`,
          heading: HeadingLevel.HEADING_2,
          spacing: {
            before: 200,
            after: 100,
          },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: news.summary,
              bold: false,
            }),
          ],
          spacing: {
            after: 100,
          },
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: `来源: ${news.source}`,
              color: "0563C1",
            }),
          ],
          spacing: {
            after: 200,
          },
        }),
      ]).flat(),
      // Footer
      new Paragraph({
        text: "--- 本简报由自动化系统生成 ---",
        alignment: AlignmentType.CENTER,
        spacing: {
          before: 400,
        },
      }),
    ],
  }],
});

// Save the document and send to Telegram
Packer.toBuffer(doc).then((buffer) => {
  fs.writeFileSync(outputPath, buffer);
  console.log(`Word document created: ${outputPath}`);
  
  // Send Telegram document using child_process exec
  const fileName = outputPath.split('/').pop();
  const fullPath = outputPath.replace('/', '\\');
  
  const curlCmd = `curl -s -X POST "https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendDocument" -F "chat_id=${TELEGRAM_CHAT_ID}" -F "document=@${fullPath}" -F "caption=今日新闻简报已生成！📄"`;
  
  exec(curlCmd, (error, stdout, stderr) => {
    if (error) {
      console.log('Telegram error:', error.message);
    } else {
      try {
        const result = JSON.parse(stdout);
        if (result.ok) {
          console.log('Telegram document sent successfully!');
        } else {
          console.log('Telegram error:', result.description);
        }
      } catch (e) {
        console.log('Telegram response parse error');
      }
    }
  });
});
