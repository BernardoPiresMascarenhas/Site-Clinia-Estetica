// Verifica a seção Essência: node scripts/manifesto-check.mjs <url> <outdir> <w>...
import { chromium } from "playwright";
const [url = "http://localhost:3123", out = "scripts/shots", ...widths] = process.argv.slice(2);
const b = await chromium.launch();
for (const w of widths.map(Number)) {
  const h = w < 800 ? 844 : 900;
  const p = await b.newPage({ viewport: { width: w, height: h } });
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForSelector("#essencia");
  await p.addStyleTag({ content: "html{scroll-behavior:auto!important} nextjs-portal{display:none!important}" });
  // rola até o meio da animação e depois até o fim
  const top = await p.evaluate(() => document.getElementById("essencia").getBoundingClientRect().top + scrollY);
  await p.evaluate((y) => scrollTo(0, y), top - h * 0.35);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}/man-${w}-mid.png` });
  await p.evaluate((y) => scrollTo(0, y), top + (w < 1024 ? 40 : 60));
  await p.waitForTimeout(1200);
  await p.screenshot({ path: `${out}/man-${w}-end.png` });
  const m = await p.evaluate(() => {
    const h2 = document.getElementById("manifesto-title");
    const lines = [...h2.querySelectorAll("[aria-hidden] span.block.whitespace-nowrap")];
    const vw = document.documentElement.clientWidth;
    const shell = h2.closest(".shell").getBoundingClientRect();
    const pad = parseFloat(getComputedStyle(h2.closest(".shell")).paddingRight);
    const rights = lines.map((l) => {
      const r = document.createRange(); r.selectNodeContents(l); return Math.round(r.getBoundingClientRect().right);
    });
    const ops = [...h2.querySelectorAll("[aria-hidden] span[style*=opacity]")].map((s) => +getComputedStyle(s).opacity);
    return { font: getComputedStyle(h2).fontSize, maxRight: Math.max(...rights), limit: Math.round(shell.right - pad), vw, minOpacity: Math.min(...ops), lines: lines.length, overflowX: document.documentElement.scrollWidth - vw };
  });
  console.log(w, JSON.stringify(m), m.maxRight <= m.limit ? "OK" : "CORTE!", "errors", errors.length);
  await p.close();
}
await b.close();
