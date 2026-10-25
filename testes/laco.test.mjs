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

/* no 1.1 (etapa 3): a figura no lugar dos três jeitos, com a pausa para investir na cena do agente */
test("a pausa da cena do agente pergunta o que ele decide, antes de a ficha acender, e a certa é a decisão dos três jeitos", async () => {
  const { pausaDe, FPS } = await import("../src/components/livro/laco/laco.ts");
  const m = montarCenas({ laco, tresJeitos });
  const p = pausaDe(m);
  const cena = m.cenas.find((c) => c.investir);
  assert.ok(cena?.chave && cena.jeito === "agente", "o investimento é na cena-chave, a do agente");
  const decide = cena.paradas.find((x) => x.peca === "decidir");
  assert.ok(p.quadro < Math.round((cena.inicio + decide.em) * FPS), "a pausa vem depois de a ficha acender");
  assert.ok(p.quadro > Math.round((cena.inicio + cena.paradas[0].em) * FPS), "a pausa vem antes de a pergunta chegar");
  assert.match(decide.texto, new RegExp(p.opcoes[p.certa]), "a opção certa não é a decisão do agente nos três jeitos");
  const errada = structuredClone(laco);
  errada.cenas.find((c) => c.investir).investir.certa = 0;
  assert.throws(() => pausaDe(montarCenas({ laco: errada, tresJeitos })), /não é a decisão/);
});

test("o 1.1 tem a figura do laço no lugar dos três jeitos e do Pendente, com a figura em texto, e diz \"observar\"", async () => {
  const { parse } = await import("node-html-parser");
  const pagina = parse(ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html"));
  const fig = pagina.querySelector("figure[data-laco]");
  assert.ok(fig, "a figura do laço não está no 1.1");
  assert.ok(fig.querySelectorAll("astro-island").some((i) => (i.getAttribute("component-url") ?? "").includes("FiguraLacoVideo")), "a figura não tem a animação");
  assert.ok(fig.querySelector("details.laco-texto [data-caminho]"), "a figura não tem a versão em texto");
  assert.ok(fig.querySelector("details.laco-texto").hasAttribute("open"), "sem JS, a figura em texto tem de vir aberta (a ilha a fecha ao carregar)");
  assert.equal(pagina.querySelectorAll(".rastro").length, 0, "os três jeitos ficaram");
  const mdx = ler("livros/ciclo-de-vida/capitulos/01-o-problema-e-o-contrato.mdx");
  assert.doesNotMatch(mdx, /<Pendente o="Figura: o laço/);
  assert.match(mdx, /observar o resultado e decidir de novo/);
  assert.doesNotMatch(mdx, /cena a cena/, "o texto fala em cenas, e o gráfico é contínuo");
});

/* o laço inteiro à vista (etapa 5): sem câmera, o leitor vê o todo o tempo todo */
test("a composição mostra o desenho inteiro em todo quadro, sem câmera", async () => {
  const L = await import("../src/components/livro/laco/laco.ts");
  assert.equal(L.camera, undefined, "o laço ainda tem câmera");
  const comp = ler("src/components/livro/laco/LacoAnimado.tsx");
  assert.match(comp, /viewBox=\{`0 0 \$\{vista\.w\} \$\{vista\.h\}`\}/, "o viewBox do desenho não é o desenho inteiro");
  assert.doesNotMatch(comp, /camera\(/);
});

test("a figura do 1.1 toca contínua, só com play e pausar, e não cena a cena", () => {
  const ilha = ler("src/components/livro/laco/FiguraLacoVideo.tsx");
  assert.match(ilha, /import TocaGrafico from "\.\.\/palco\/TocaGrafico"/);
  assert.doesNotMatch(ilha, /AvancaCena/);
  const base = ler("src/components/livro/palco/TocaGrafico.tsx");
  assert.doesNotMatch(base, /type="range"/, "a barra do tempo ficou");
  assert.doesNotMatch(base, /tg-tempo/, "o tempo ficou");
  assert.match(base, /isPlaying\(\)/, "a pausa para investir não confere se está tocando");
});
