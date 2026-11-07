// Capturas de tela para revisão visual: node scripts/shots.mjs <url> <outdir> [w,h ...]
import { chromium, webkit } from "playwright";
import fs from "node:fs";

const url = process.argv[2] ?? "http://localhost:3123";
const out = process.argv[3] ?? "scripts/shots";
const engine = process.env.ENGINE === "webkit" ? webkit : chromium;
const sizes = (process.argv.slice(4).length ? process.argv.slice(4) : ["1440x900", "390x844"]).map((s) => s.split("x").map(Number));
fs.mkdirSync(out, { recursive: true });

const browser = await engine.launch();
for (const [w, h] of sizes) {
  const ctx = await browser.newContext({ viewport: { width: w, height: h }, deviceScaleFactor: 1, isMobile: w < 800 && process.env.ENGINE !== "webkit", hasTouch: w < 800 });
  const page = await ctx.newPage();
  const errors = [];
  page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
  page.on("pageerror", (e) => errors.push(String(e)));
  await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
  await page.waitForTimeout(3200);
  await page.screenshot({ path: `${out}/${w}-00-hero.png` });
  // percorre a página em passos de 1 viewport
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
  let i = 1;
  for (let y = h; y < total; y += h) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: "instant" }), y);
    await page.waitForTimeout(900);
    await page.screenshot({ path: `${out}/${w}-${String(i++).padStart(2, "0")}.png` });
  }
  console.log(`${w}x${h}: height=${total} overflowX=${overflow} shots=${i} errors=${errors.length}`);
  errors.slice(0, 8).forEach((e) => console.log("  ERR", e.slice(0, 300)));
  await ctx.close();
}
await browser.close();
