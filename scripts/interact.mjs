// Testa as interações principais: node scripts/interact.mjs <url> <outdir> <w>x<h>
import { chromium, webkit } from "playwright";
import fs from "node:fs";

const url = process.argv[2] ?? "http://localhost:3123";
const out = process.argv[3] ?? "scripts/shots";
const [w, h] = (process.argv[4] ?? "1440x900").split("x").map(Number);
const engine = process.env.ENGINE === "webkit" ? webkit : chromium;
fs.mkdirSync(out, { recursive: true });
const mobile = w < 800;

const browser = await engine.launch();
const ctx = await browser.newContext({ viewport: { width: w, height: h }, hasTouch: mobile, isMobile: mobile && process.env.ENGINE !== "webkit" });
const page = await ctx.newPage();
const errors = [];
page.on("console", (m) => m.type() === "error" && errors.push(m.text()));
page.on("pageerror", (e) => errors.push(String(e)));
const shot = (n) => page.screenshot({ path: `${out}/i${w}-${n}.png` });
const ok = (label, cond) => console.log(`${cond ? "PASS" : "FAIL"} ${label}`);
const click = async (loc) => (mobile ? loc.tap() : loc.click());

await page.goto(url, { waitUntil: "networkidle", timeout: 120000 });
await page.waitForTimeout(2500);

// Menu
if (mobile) {
  await click(page.getByRole("button", { name: "Abrir menu" }));
  await page.waitForTimeout(900);
  await shot("menu");
  ok("menu abre", await page.locator("#menu-mobile").isVisible());
  await click(page.locator("#menu-mobile").getByRole("link", { name: "Tratamentos" }));
  await page.waitForTimeout(1500);
  ok("menu fecha ao navegar", !(await page.locator("#menu-mobile").count()));
}

// Tratamentos → drawer
await page.locator("#tratamentos").scrollIntoViewIfNeeded();
const rows = page.locator("#tratamentos ol > li > button");
await click(rows.nth(2));
await page.waitForTimeout(1200);
await shot("treat");
await click(page.locator("#treat-panel-hidratacao").getByRole("button", { name: "Ver detalhes" }));
await page.waitForTimeout(1000);
await shot("drawer");
const dlg = page.getByRole("dialog");
ok("drawer abre", await dlg.isVisible());
ok("foco dentro do drawer", await page.evaluate(() => !!document.activeElement?.closest('[role="dialog"]')));
await page.keyboard.press("Escape");
await page.waitForTimeout(900);
ok("drawer fecha com Esc", !(await page.getByRole("dialog").count()));

// Explorador
await page.locator("#explorar").scrollIntoViewIfNeeded();
await click(page.getByRole("radio", { name: /Relaxamento/ }));
await page.waitForTimeout(1400);
await page.locator("#explorar h3").first().scrollIntoViewIfNeeded();
await shot("explorer");
ok("explorador mostra resultado", (await page.locator("#explorar h3").first().textContent())?.includes("Pausar"));

// Galeria → lightbox
await page.locator("#galeria").scrollIntoViewIfNeeded();
await click(page.getByRole("button", { name: /Ampliar imagem: Texturas/ }));
await page.waitForTimeout(1100);
await shot("lightbox");
ok("lightbox abre", await page.getByRole("dialog", { name: "Visualização ampliada" }).isVisible());
await page.keyboard.press("ArrowRight");
await page.waitForTimeout(600);
await click(page.getByRole("button", { name: "Fechar" }));
await page.waitForTimeout(900);

// Agendamento
await page.locator("#agendar").scrollIntoViewIfNeeded();
const B = page.locator("#agendar");
await click(B.getByText("Limpeza de Pele").first());
await click(B.getByRole("button", { name: "Continuar" }));
await page.waitForTimeout(600);
await click(B.getByText("Primeira visita"));
await click(B.getByText("Tarde", { exact: true }));
await click(B.getByRole("button", { name: "Continuar" }));
await page.waitForTimeout(600);
await click(B.locator('label:has(input[name="date"]:not([disabled]))').first());
await shot("booking-date");
await click(B.getByRole("button", { name: "Continuar" }));
await page.waitForTimeout(600);
await click(B.locator('label:has(input[name="time"]:not([disabled]))').first());
await click(B.getByRole("button", { name: "Continuar" }));
await page.waitForTimeout(600);
await shot("booking-summary");
await click(B.getByRole("button", { name: "Concluir simulação" }));
await page.waitForTimeout(1500);
await B.getByText("Simulação concluída").scrollIntoViewIfNeeded();
await shot("booking-done");
ok("agendamento concluído", await B.getByText("Simulação concluída").isVisible());

// FAQ
const faqBtn = page.locator("#duvidas button").nth(1);
await click(faqBtn);
await page.waitForTimeout(800);
ok("faq abre", (await faqBtn.getAttribute("aria-expanded")) === "true");

const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
ok(`sem overflow horizontal (${overflow})`, overflow <= 0);
console.log("console errors:", errors.length);
errors.slice(0, 10).forEach((e) => console.log("  ERR", e.slice(0, 300)));
await browser.close();
