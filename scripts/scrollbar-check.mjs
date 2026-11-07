// Verifica a scrollbar principal no Chromium: node scripts/scrollbar-check.mjs <url> <outdir>
import { chromium } from "playwright";
const [url = "http://localhost:3123", out = "scripts/shots"] = process.argv.slice(2);
const b = await chromium.launch({ ignoreDefaultArgs: ["--hide-scrollbars"] });
const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto(url, { waitUntil: "networkidle" });
await p.evaluate(() => scrollTo(0, document.documentElement.scrollHeight * 0.3));
await p.waitForTimeout(800);
const info = await p.evaluate(() => ({
  scrollbarWidth: innerWidth - document.documentElement.clientWidth,
  stdProps: getComputedStyle(document.documentElement).scrollbarColor,
  overflowX: document.documentElement.scrollWidth - document.documentElement.clientWidth,
}));
console.log("página:", JSON.stringify(info));
const clip = { x: 1440 - 60, y: 0, width: 60, height: 900 };
await p.screenshot({ path: `${out}/sb-idle.png`, clip });
// posição do thumb: procura a coluna mais à direita por cor
const thumbY = Math.round(900 * (0.3 * (await p.evaluate(() => document.documentElement.scrollHeight)) / (await p.evaluate(() => document.documentElement.scrollHeight))) + 40);
await p.mouse.move(1436, thumbY);
await p.waitForTimeout(400);
await p.screenshot({ path: `${out}/sb-hover.png`, clip });
// contêiner interno (painel de tratamento) mantém a barra padrão?
await p.setViewportSize({ width: 1440, height: 520 });
await p.locator("#tratamentos").scrollIntoViewIfNeeded();
await p.locator("#treat-panel-avaliacao").getByRole("button", { name: "Ver detalhes" }).click();
await p.waitForTimeout(1000);
const inner = await p.evaluate(() => {
  const el = document.querySelector('[role="dialog"] .overflow-y-auto');
  return { innerScrollbar: el.offsetWidth - el.clientWidth, scrolls: el.scrollHeight > el.clientHeight };
});
console.log("painel interno:", JSON.stringify(inner));
await b.close();
