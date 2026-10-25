/** O laço do agente, no 1.1 (docs/capacidades/laco-do-agente.md): o elenco sai dos dados do livro, e o desenho cabe, sem
 *  peça em cima de peça, no computador e no celular. E a base das animações, que o mapa da introdução já usa. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const { montarElenco, caixas, setas, VISTA, PECAS } = await import("../src/components/livro/laco/laco.ts");
const laco = json("livros/ciclo-de-vida/figuras/laco.json");
const tresJeitos = json("livros/ciclo-de-vida/figuras/tres-jeitos.json");
const clientes = json("livros/ciclo-de-vida/projeto/dados/clientes.json");

test("o elenco é o da loja: a cliente do e-mail da pergunta, a mensagem dela e as ferramentas que o agente chama", () => {
  const e = montarElenco({ laco, tresJeitos, clientes });
  assert.equal(e.cliente.nome, "Carla Mendes");
  assert.equal(e.cliente.mensagem, "Quando chega o BT-1003?");
  assert.deepEqual(e.ferramentas, ["consultar_pedido", "buscar_produto"]);
  assert.deepEqual([e.nomes.decidir, e.nomes.agir, e.nomes.observar, e.nomes.responder], ["decidir", "agir", "observar", "responder"]);
  const outra = structuredClone(tresJeitos);
  outra.perguntas[0].texto = "Quando chega? E-mail ninguem@exemplo.test";
  assert.throws(() => montarElenco({ laco, tresJeitos: outra, clientes }), /não é de um cliente da loja/);
});

test("no computador e no celular, cada peça cabe no desenho e nenhuma fica em cima da outra; as setas também cabem", () => {
  for (const desenho of ["largo", "coluna"]) {
    const c = caixas(desenho), v = VISTA[desenho];
    for (const p of PECAS) {
      const b = c[p];
      assert.ok(b.x >= 0 && b.y >= 0 && b.x + b.w <= v.w && b.y + b.h <= v.h, `${desenho}: ${p} sai do desenho`);
      for (const q of PECAS) {
        if (p >= q) continue;
        const o = c[q], folga = 8;
        const longe = b.x + b.w + folga <= o.x || o.x + o.w + folga <= b.x || b.y + b.h + folga <= o.y || o.y + o.h + folga <= b.y;
        assert.ok(longe, `${desenho}: ${p} e ${q} se encostam`);
      }
    }
    for (const [id, s] of Object.entries(setas(desenho, laco.setas))) {
      for (const [x, y] of [s.de, s.para, ...(s.em ? [s.em] : [])]) assert.ok(x >= 0 && x <= v.w && y >= 0 && y <= v.h, `${desenho}: a seta ${id} sai do desenho`);
      if (!s.rotulo) continue;
      // o rótulo (centrado em `em`, 13 px, cerca de 6,6 px por letra) não fica embaixo de nenhuma caixa
      const r = { x: s.em[0] - (s.rotulo.length * 6.6) / 2, y: s.em[1] - 12, w: s.rotulo.length * 6.6, h: 16 };
      assert.ok(r.x >= 0 && r.x + r.w <= v.w, `${desenho}: o rótulo "${s.rotulo}" sai do desenho`);
      for (const p of PECAS) {
        const o = c[p];
        assert.ok(r.x + r.w <= o.x || o.x + o.w <= r.x || r.y + r.h <= o.y || o.y + o.h <= r.y, `${desenho}: o rótulo "${s.rotulo}" fica embaixo de ${p}`);
      }
    }
    assert.ok(setas(desenho, laco.setas).de_novo.volta, `${desenho}: a volta do laço não está marcada`);
  }
});

test("o mapa da introdução avança sobre a base das animações, e não tem um Player só dele", () => {
  const ilha = ler("src/components/livro/ciclo/FiguraCiclo.tsx");
  assert.match(ilha, /import AvancaCena from "\.\.\/palco\/AvancaCena"/);
  assert.doesNotMatch(ilha, /@remotion\/player/);
  assert.match(ler("src/components/livro/palco/AvancaCena.tsx"), /prefers-reduced-motion/);
});

/* as cenas (etapa 2): cada uma anda pelos passos de um jeito, e o quadro final soma os acertos */
const { montarCenas, cortes, placar, rota } = await import("../src/components/livro/laco/laco.ts");

test("cada cena anda pelos passos do seu jeito, da cliente à resposta, só por setas do laço, e termina como nos três jeitos", () => {
  const m = montarCenas({ laco, tresJeitos });
  for (const c of m.cenas.filter((x) => x.jeito)) {
    const passos = tresJeitos.modos.find((x) => x.id === c.jeito).passos[c.pergunta];
    assert.equal(c.paradas[0].peca, "cliente");
    const fim = c.paradas[c.paradas.length - 1];
    assert.equal(fim.peca, "responder");
    assert.equal(fim.resultado, passos.find((p) => p.quem === "resposta").certo ? "certo" : "erro", `${c.jeito}, ${c.pergunta}`);
    c.paradas.forEach((p, i) => { if (i) assert.ok(rota(c.paradas[i - 1].peca, p.peca), `${c.jeito}: de ${c.paradas[i - 1].peca} para ${p.peca}`); });
    for (let i = 1; i < c.paradas.length; i++) assert.ok(c.paradas[i].em - c.paradas[i - 1].em >= 1, `${c.jeito}: um passo com menos de 1 s`);
  }
});

test("só o agente decide de novo; o fluxo fixo segue a ordem do código; o modelo sozinho faz uma passada e não decide", () => {
  const m = montarCenas({ laco, tresJeitos });
  const cena = (j, q) => m.cenas.find((c) => c.jeito === j && c.pergunta === q);
  assert.ok(cena("agente", "produto").usa.includes("de_novo"));
  for (const [j, q] of [["fluxo", "pedido"], ["fluxo", "produto"], ["modelo", "pedido"]]) assert.ok(!cena(j, q).usa.includes("de_novo"), `${j}, ${q} decide de novo`);
  assert.ok(cena("fluxo", "pedido").usa.includes("segue"));
  for (const [j, q] of [["fluxo", "pedido"], ["agente", "produto"]]) assert.ok(cena(j, q).usa.includes("agir"), `${j}: a pergunta passa por agir, e ele fica apagado`);
  assert.ok(cena("modelo", "pedido").usa.includes("direto") && !cena("modelo", "pedido").usa.includes("decidir"));
  assert.deepEqual(cena("fluxo", "pedido").paradas.filter((p) => p.ficha).map((p) => p.ficha), ["codigo"]);
  assert.deepEqual(cena("agente", "produto").paradas.filter((p) => p.ficha).map((p) => p.ficha), ["modelo", "modelo"]);
});

test("a animação cabe no docs/RITMO.md, e o quadro final soma os acertos dos três jeitos", () => {
  const m = montarCenas({ laco, tresJeitos });
  assert.ok(m.cenas.length <= 6 && m.total <= 45);
  assert.equal(cortes(m).length, m.cenas.length);
  assert.ok(m.cenas.some((c) => c.chave && c.jeito === "agente"), "o momento-chave é o do agente");
  assert.ok(m.cenas[m.cenas.length - 1].final, "a última cena é o quadro final");
  assert.deepEqual(placar(tresJeitos).map((p) => [p.nome, p.acertos]), [["só o modelo", [false, false]], ["fluxo fixo", [true, false]], ["agente", [true, true]]]);
  const longa = structuredClone(laco);
  longa.cenas[2].segundos = 4;
  assert.throws(() => montarCenas({ laco: longa, tresJeitos }), /curta demais/);
});
