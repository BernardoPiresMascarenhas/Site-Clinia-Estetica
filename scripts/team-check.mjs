// Captura a seção Equipe em várias larguras: node scripts/team-check.mjs <url> <outdir> <w>...
import { chromium } from "playwright";
const [url = "http://localhost:3123", out = "scripts/shots", ...widths] = process.argv.slice(2);
const b = await chromium.launch();
for (const w of widths.map(Number)) {
  const mobile = w < 800;
  const p = await b.newPage({ viewport: { width: w, height: mobile ? 900 : 900 }, hasTouch: false });
  const errors = [];
  p.on("pageerror", (e) => errors.push(String(e)));
  await p.goto(url, { waitUntil: "networkidle" });
  await p.waitForTimeout(1200);
  const sec = p.locator("#equipe");
  await sec.scrollIntoViewIfNeeded();
  await p.waitForTimeout(1000);
  await sec.screenshot({ path: `${out}/team-${w}-a.png` });
  const name1 = await sec.locator("h3").first().textContent();
  // avança pela seta e confere troca sincronizada
  const nextBtn = sec.getByRole("button", { name: "Próximo perfil" });
  await nextBtn.scrollIntoViewIfNeeded();
  await p.waitForTimeout(900);
  await nextBtn.click();
  await p.waitForTimeout(1300);
  const name2 = await sec.locator("h3").first().textContent();
  const quote = await sec.locator("blockquote").first().textContent();
  const alt = await sec.locator('img[alt]:not([alt=""])').first().getAttribute("alt");
  await sec.scrollIntoViewIfNeeded();
  await p.waitForTimeout(900);
  await sec.screenshot({ path: `${out}/team-${w}-b.png` });
  // arraste no retrato
  const card = sec.locator("[style*='z-index: 10']").first();
  await card.scrollIntoViewIfNeeded();
  await p.waitForTimeout(900);
  const box = await card.boundingBox();
  await p.mouse.move(box.x + box.width / 2, box.y + box.height / 2);
  await p.mouse.down();
  await p.mouse.move(box.x + box.width / 2 - 160, box.y + box.height / 2, { steps: 8 });
  await p.mouse.up();
  await p.waitForTimeout(1300);
  const name3 = await sec.locator("h3").first().textContent();
  const ov = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  console.log(w, { name1, name2, name3, quote: quote.slice(0, 30), alt: alt.slice(0, 40), overflow: ov, errors: errors.length });
  await p.close();
}
await b.close();
