/** Capítulo 1: a epígrafe tem fonte, e os três jeitos da figura 1.1 só usam dados que existem na loja. Rode depois de `astro build`. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const html = ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html");
const figura = JSON.parse(ler("livros/ciclo-de-vida/figuras/tres-jeitos.json"));
const pedidos = JSON.parse(ler("livros/ciclo-de-vida/marcos/cap-01/dados/pedidos.json"));
const catalogo = JSON.parse(ler("livros/ciclo-de-vida/marcos/cap-01/dados/catalogo.json"));

test("a epígrafe sai com autor, obra e ano", () => {
  assert.match(html, /<figure class="epigrafe"[^>]*>\s*<blockquote[^>]*>Apaixone-se pelo problema, não pela solução\.<\/blockquote>/);
  assert.match(html, /Uri Levine, cofundador do Waze, em <cite[^>]*>Apaixone-se pelo problema, não pela solução<\/cite> \(2023\)/);
});

test("os três jeitos da figura 1.1 têm um caminho para cada jeito e cada pergunta", () => {
  const caminhos = figura.modos.flatMap((m) => Object.keys(m.passos).map((p) => `${m.id}/${p}`));
  assert.deepEqual(caminhos.sort(), ["agente/pedido", "agente/produto", "fluxo/pedido", "fluxo/produto", "modelo/pedido", "modelo/produto"]);
});

test("o que as ferramentas devolvem na figura bate com os dados da loja", () => {
  const p = pedidos.find((x) => x.id === "BT-1003");
  const [, mes, dia] = p.previsao_entrega.split("-");
  const frigideira = catalogo.find((x) => x.nome.startsWith("Frigideira antiaderente 24 cm"));
  const ferramentas = figura.modos.flatMap((m) => Object.values(m.passos).flat()).filter((s) => s.quem === "ferramenta");
  assert.ok(ferramentas.length >= 3);
  for (const s of ferramentas) {
    if (s.texto.startsWith("consultar_pedido")) {
      assert.ok(s.texto.includes(`previsão ${dia}/${mes}`), s.texto);
      assert.ok(s.texto.includes(p.status), s.texto);
    } else if (s.texto.startsWith("buscar_produto")) {
      assert.ok(frigideira.detalhes.includes("até 180 °C") && s.texto.includes("até 180 °C"), s.texto);
      assert.ok(frigideira.detalhes.includes("sem o cabo de silicone") && s.texto.includes("sem o cabo de silicone"), s.texto);
    } else assert.fail(`ferramenta sem conferência: ${s.texto}`);
  }
});

test("a pergunta da figura com pedido traz o e-mail do dono, como o contrato exige", () => {
  const q = figura.perguntas.find((x) => x.id === "pedido").texto;
  assert.ok(q.includes("BT-1003") && q.includes("carla.mendes@exemplo.test"));
});
