/** A IDE do capítulo 1: o caminho inteiro da pasta vazia à nota de partida, montado do roteiro e das saídas reais. */
import { test } from "node:test";
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { montarIde, perguntaSustentada, perguntasPendentes, quadrosDaIde } from "../src/lib/ideCapitulo.ts";

const ler = (p) => readFileSync(new URL(`../${p}`, import.meta.url), "utf8");
const json = (p) => JSON.parse(ler(p));
const entrada = () => ({
  roteiro: json("livros/ciclo-de-vida/roteiros/01.json"), estados: json("livros/ciclo-de-vida/roteiros/01.estados.json"),
  saidas: json("livros/ciclo-de-vida/saidas.json"), capitulo: json("livros/ciclo-de-vida/passos/01.json"),
  secoes: { "1.6a": "O projeto", "1.6b": "O contrato", "1.6c": "As perguntas", "1.6d": "A nota de partida" },
  glossario: json("livros/ciclo-de-vida/glossario.json"),
  pasta: json("livros/ciclo-de-vida/comandos.json").pasta_do_leitor.replace(/^\/home\/voce/, "~"),
});
const { acoes, passos } = await montarIde(entrada());

test("18 passos cobrem as 40 ações do roteiro, sem buraco", () => {
  assert.equal(passos.length, 18);
  assert.equal(acoes.length, 40);
  passos.forEach((p, i) => assert.equal(p.de, i === 0 ? 1 : passos[i - 1].ate + 1, p.id));
  assert.equal(passos.at(-1).ate, 40);
});

test("o projeto nasce da pasta vazia: uv init em ~, o main.py apagado, e o que o uv add mudou", () => {
  assert.deepEqual([acoes[0].tipo, acoes[0].comando, acoes[0].onde], ["rodar", "uv init atendimento-bemtevi", "~"]);
  assert.deepEqual(acoes[0].gerados.map((g) => g.nome).sort(), [".gitignore", ".python-version", "README.md", "main.py", "pyproject.toml"]);
  assert.deepEqual([acoes[1].tipo, acoes[1].arquivo], ["apagar", "main.py"]);
  const add = acoes.find((a) => a.tipo === "rodar" && a.comando === "uv add pydantic");
  assert.deepEqual(add.gerados.find((g) => g.nome === "pyproject.toml").alteradas, [7, 8, 9]);   // "dependencies = []" vira a lista com o pydantic
  assert.ok(add.gerados.find((g) => g.nome === "uv.lock").novo);
});

test("o sinal de cada passo sai da saída gravada", () => {
  assert.deepEqual(passos.map((p) => `${p.id}:${p.sinal}`), ["projeto-nasce:ok", "pydantic:ok", "pytest:ok", "a-loja:nada", "decisoes:erro", "caso:erro",
    "ler-arquivo:nada", "tres-perguntas:ok", "caso-apressado:engano", "contrato-se-protege:erro", "vinte-perguntas:engano", "le-a-loja:ok",
    "o-que-os-testes-leem:nada", "testes-de-formato:engano", "regras-da-politica:erro", "r12-corrigido:ok", "agente-mais-simples:ok", "a-regua:ok"]);
});

test("o caminho do erro chega dobrado: o contrato.py à vista, as bibliotecas dentro da dobra", () => {
  const barrado = acoes.find((a) => a.tipo === "rodar" && a.id === "r01-caso-sem-pedido-barrado");
  const vis = barrado.saida.filter((t) => t.tipo === "linha").map((t) => t.l).join("\n");
  assert.match(vis, /contrato\.py", line 54/);
  assert.doesNotMatch(vis, /site-packages/);
  assert.ok(barrado.saida.some((t) => t.tipo === "dobra" && t.linhas.some(([l]) => l.includes("site-packages"))));
});

test("o livro não monta com buraco entre passos", async () => {
  const buraco = entrada(); buraco.capitulo.passos[4].de += 1;
  await assert.rejects(montarIde(buraco), /nenhum pedaço do caminho pode sumir/);
});

test("a página traz a IDE do capítulo, e nenhum texto de exemplo", () => {
  const html = ler("dist/ciclo-de-vida/01-o-problema-e-o-contrato/index.html");
  assert.match(html, /component-url="[^"]*IdeCapitulo[^"]*"/);
  assert.equal([...html.matchAll(/class="ic-ponto /g)].length, 18);
  assert.doesNotMatch(html, /EXEMPLO/);
});

test("o código entra por blocos lógicos, e cada bloco cai nas linhas certas do arquivo daquele momento", () => {
  const comBlocos = acoes.filter((a) => a.tipo === "editar" && a.blocos.length);
  assert.equal(comBlocos.length, 10);
  const caso = comBlocos.find((a) => a.blocos.some((b) => b.titulo === "o molde"));
  assert.equal(caso.blocos.length, 5);
  assert.ok(caso.blocos.every((b, i) => i === 0 || b.a > caso.blocos[i - 1].z), "os blocos seguem a ordem do arquivo");
  for (const a of comBlocos) for (const b of a.blocos) for (const t of b.termos) assert.ok(t.texto.length > 10, `${b.titulo}: ${t.chave}`);
});

test("no guiado, cada ação ocupa um quadro e leva todos os blocos; as duas perguntas continuam segurando a saída", () => {
  const quadros = quadrosDaIde(passos);
  assert.equal(quadros.filter((q) => q.tipo === "abre").length, 18);
  assert.equal(quadros.filter((q) => q.tipo === "acao").length, 40);
  assert.equal(quadros.filter((q) => q.tipo === "fecha").length, 18);
  const caso = acoes[10];
  assert.equal(caso.tipo, "editar");
  assert.equal(caso.blocos.length, 5);
  assert.deepEqual(perguntasPendentes(caso, false), ["bloco:1", "bloco:4"]);
  assert.deepEqual(perguntasPendentes(caso, false, [1]), ["bloco:4"]);
  assert.deepEqual(perguntasPendentes(caso, false, [1, 4]), []);
  assert.deepEqual(perguntasPendentes(caso, true), [], "o modo direto continua sem perguntas de bloco");
  const componente = ler("src/components/livro/ide/IdeCapitulo.tsx");
  assert.doesNotMatch(componente, /E o próximo\?/);
  assert.match(componente, /a\.blocos\.flatMap\(\(b, bi\)/);
});

test("um quadro guiado continua dentro do limite de cerca de 15 linhas novas", () => {
  const codigo = acoes.filter((a) => a.tipo === "editar" && !/\.(jsonl?|md|toml)$/.test(a.arquivo));
  assert.ok(codigo.every((a) => a.alteradas.length <= 16), codigo.map((a) => `${a.arquivo}: ${a.alteradas.length}`).join(", "));
  assert.equal(Math.max(...codigo.map((a) => a.alteradas.length)), 16);
});

test("a pergunta do id: só a resposta certa segue o padrão do contrato real", () => {
  const contrato = ler("livros/ciclo-de-vida/marcos/cap-01/contrato.py");
  const padrao = new RegExp(contrato.match(/id: str = Field\(pattern=r"([^"]+)"\)/)[1]);
  const q = acoes.flatMap((a) => a.tipo === "editar" ? a.blocos : []).find((b) => b.pergunta?.texto.includes("ids")).pergunta;
  q.opcoes.forEach((o, i) => assert.equal(padrao.test(o), i === q.certa, o));
});

test("a pergunta do pedido: o roteiro mostra o caso apressado passando antes da regra", () => {
  const saidas = json("livros/ciclo-de-vida/saidas.json");
  const q = acoes.flatMap((a) => a.tipo === "editar" ? a.blocos : []).find((b) => b.pergunta?.texto.includes("pedidos")).pergunta;
  assert.equal(q.opcoes[q.certa], "deixam passar");
  assert.equal(saidas["r01-caso-sem-pedido-passa"].saiu_com, 0);
  assert.notEqual(saidas["r01-caso-sem-pedido-barrado"].saiu_com, 0);
});

test("cinco confirmações viram perguntas sustentadas pela saída e bloqueiam somente o guiado", async () => {
  const saidas = json("livros/ciclo-de-vida/saidas.json");
  const ids = ["r01-caso-id-torto", "r01-tres-casos", "r01-seis-pedidos", "r01-testes-passam", "r01-sempre-passar"];
  const comPergunta = acoes.filter((a) => a.tipo === "rodar" && a.perguntaSaida);
  assert.deepEqual(comPergunta.map((a) => a.id), ids);
  for (const a of comPergunta) {
    assert.equal(perguntaSustentada(saidas[a.id].saida, a.perguntaSaida), true, a.id);
    assert.deepEqual(perguntasPendentes(a, false), ["saida"], a.id);
    assert.deepEqual(perguntasPendentes(a, false, [], true), [], `${a.id}: responder libera`);
    assert.deepEqual(perguntasPendentes(a, true), [], `${a.id}: direto omite`);
  }
  const falsa = entrada();
  falsa.roteiro.passos[11].pergunta_saida.opcoes[0] = "uma resposta que não está na saída";
  await assert.rejects(montarIde(falsa), /resposta certa.*não aparece na saída gravada/);
});

test("o livro não monta com um bloco que não está no arquivo, nem com palavra fora do glossário", async () => {
  const torto = entrada(); torto.roteiro.passos[7].blocos[0].linhas = "62-64";   // a função carregar, que ainda não existe nesse momento
  await assert.rejects(montarIde(torto), /não está em contrato\.py nesse momento/);
  const sem = entrada(); sem.roteiro.passos[7].blocos[0].termos = ["palavra-que-nao-existe"];
  await assert.rejects(montarIde(sem), /não está no glossário/);
});

test("o ponto de volta só aparece com o repositório do leitor, e aponta a tag do fim do passo anterior", async () => {
  const sem = entrada(); delete sem.capitulo.repositorio;
  assert.ok((await montarIde(sem)).passos.every((p) => !p.volta), "sem repositório, nenhum passo mostra o checkout");
  const { passos: ps } = await montarIde(entrada());
  assert.equal(ps[0].volta, undefined);   // o passo 1 começa da pasta vazia: não há para onde voltar
  assert.equal(ps[4].volta.repositorio, "https://github.com/Erick-Marinho/atendimento-bemtevi");
  assert.equal(ps[4].volta.tag, "cap-01/passo-04");
});

test("quatro fechos oferecem uma parada sem bloquear, com a entrega e a tag daquele ponto", async () => {
  assert.deepEqual(passos.filter((p) => p.parada).map((p) => [p.n, p.parada.tag]), [
    [4, "cap-01/passo-04"], [10, "cap-01/passo-10"], [16, "cap-01/passo-16"], [18, "cap-01/fim"],
  ]);
  assert.ok(passos.filter((p) => p.parada).every((p) => p.parada.entrega.length > 20));
  assert.match(ler("src/components/livro/ide/IdeCapitulo.tsx"), /Bom lugar para parar.*Ficou pronto/s);
  const torta = entrada(); torta.capitulo.passos[3].parada.tag = "cap-01/passo-03";
  await assert.rejects(montarIde(torta), /parada precisa apontar cap-01\/passo-04/);
});

test("todo passo abre com a mensagem do autor ao chat, e o rascunho fica marcado até o autor revisar", async () => {
  assert.ok(passos.every((p) => p.pedido.trim().length > 10), "todo passo tem o pedido");
  const sem = entrada(); delete sem.capitulo.passos[3].pedido;
  await assert.rejects(montarIde(sem), /não tem o pedido do autor/);
  const revisado = entrada(); revisado.capitulo.passos[0].pedido_revisado = true;
  assert.equal((await montarIde(revisado)).passos[0].rascunho, false);
});

test("o rodapé sabe o Python do projeto: o que o uv achou ao criar o .venv", async () => {
  const { python } = await montarIde(entrada());
  assert.match(python.versao, /^3\.13\.\d+$/);
  assert.equal(acoes[python.desde].comando, "uv add pydantic");
});

/* ===== o capítulo 2: a IDE abre onde o capítulo 1 terminou ===== */
const roteiro02 = json("livros/ciclo-de-vida/roteiros/02.json");
const passos02 = json("livros/ciclo-de-vida/passos/02.json");
const cap02 = await montarIde({ ...entrada(), roteiro: roteiro02, estados: json("livros/ciclo-de-vida/roteiros/02.estados.json"),
  capitulo: passos02, secoes: { "2.5a": "O agente", "2.5b": "Testar sem pagar", "2.5c": "A nota do agente" },
  anteriores: [json("livros/ciclo-de-vida/roteiros/01.estados.json")],
  gravacoes: { "r02-medir": { quando: "2026-10-24", modelo: "gpt-6-luna", chamadas: 21 } } });

test("o capítulo 1 abre numa pasta vazia; o 2, com o projeto do fim do 1", async () => {
  assert.equal((await montarIde(entrada())).iniciais.length, 0);
  const nomes = cap02.iniciais.map((f) => f.nome).sort();
  assert.deepEqual(nomes, [".gitignore", ".python-version", "README.md", "baseline.py", "contrato.py", "dados/catalogo.json", "dados/clientes.json",
    "dados/loja.json", "dados/pedidos.json", "dados/politica.md", "pyproject.toml", "referencia.jsonl", "test_referencia.py", "uv.lock"]);
  /* o uv add do capítulo 2 muda arquivos que já existiam: não são novos */
  const add = cap02.acoes[0];
  assert.equal(add.comando, "uv add langgraph");
  assert.deepEqual(add.gerados.map((g) => [g.nome, g.novo]).sort(), [["pyproject.toml", false], ["uv.lock", false]]);
  assert.ok(cap02.acoes.find((a) => a.tipo === "editar" && a.arquivo === "agente.py").novo);
  /* o ponto de volta do primeiro passo é o início do capítulo */
  assert.equal(cap02.passos[0].volta.repositorio, "https://github.com/Erick-Marinho/atendimento-bemtevi");
  assert.equal(cap02.passos[0].volta.tag, "cap-02/inicio");
});

test("o comando que chamou o modelo diz quando e com qual foi gravado; os outros, não", () => {
  const rodados = cap02.acoes.filter((a) => a.tipo === "rodar");
  assert.deepEqual(rodados.filter((a) => a.gravacao).map((a) => [a.id, a.gravacao.modelo, a.gravacao.chamadas]), [["r02-medir", "gpt-6-luna", 21]]);
});

test("o resumo da gravação sai do arquivo gravado de verdade", async () => {
  const { resumirGravacao } = await import("../src/lib/ideCapitulo.ts");
  assert.deepEqual(resumirGravacao(json("livros/ciclo-de-vida/gravacoes/r02-medir.json")), { quando: "2026-10-24", modelo: "gpt-6-luna", chamadas: 21 });
});

test("o capítulo 2: 10 passos sem buraco, um erro de verdade no caminho, e a IDE abre no contrato", () => {
  assert.equal(cap02.passos.length, 10);
  assert.equal(cap02.passos.at(-1).ate, roteiro02.passos.length);
  assert.equal(cap02.abreCom, "contrato.py");
  assert.deepEqual(cap02.passos.map((p) => p.sinal), ["ok", "nada", "nada", "nada", "nada", "erro", "ok", "ok", "ok", "ok"]);
  const falso = cap02.acoes.find((a) => a.id === "r02-pytest-falso");
  assert.match(falso.saida.map((t) => t.l).join("\n"), /NotImplementedError: with_structured_output is not implemented/);
  assert.ok(cap02.acoes.filter((a) => a.tipo === "editar").some((a) => a.blocos.length), "os blocos do agente entraram");
});

test("o texto do capítulo 2 diz a nota que a gravação deu", () => {
  const nota = json("livros/ciclo-de-vida/saidas.json")["r02-medir"].saida.map(([l]) => l).find((l) => l.startsWith("nota do agente"));
  const pct = nota.match(/\((\d+%)\)/)[1];
  const fim = passos02.passos.find((p) => p.id === "a-nota");
  assert.ok(fim.depois.join(" ").startsWith(pct), `o passo diz "${fim.depois[0].slice(0, 20)}…", e a gravação deu ${pct}`);
  assert.ok(ler("livros/ciclo-de-vida/capitulos/02-o-primeiro-agente.mdx").includes(pct), `o capítulo 2 não diz ${pct}`);
  /* as frases do modelo citadas no texto estão, palavra por palavra, na gravação */
  const gravada = ler("livros/ciclo-de-vida/gravacoes/r02-medir.json");
  for (const citada of ["Não tenho acesso ao status de entrega do pedido BT-1001", "A política da loja não informa o prazo para reclamar de um defeito"])
    assert.ok(gravada.includes(citada), `a gravação não tem: ${citada}`);
  const aposta = roteiro02.passos.find((p) => p.id === "r02-medir").aposta;
  assert.equal(aposta.opcoes[aposta.certa], "um pouco mais que a nota de partida");
});

test("modificar antes de criar: as variantes trazem a saída gravada de cada troca, e a linha certa do arquivo", () => {
  const nota = acoes.find((a) => a.tipo === "rodar" && a.id === "r01-nota-de-partida").variar;
  assert.equal(nota.arquivo, "baseline.py");
  assert.equal(nota.linha, 14);
  assert.deepEqual(nota.opcoes.map((o) => o.saida.at(-1).l), ["nota de partida: 8 de 20 (40%)", "nota de partida: 5 de 20 (25%)", "nota de partida: 2 de 20 (10%)"]);
  assert.ok(nota.opcoes.every((o) => o.alteradas.length === 1 && o.alteradas[0] === 14));
  const talvez = acoes.find((a) => a.tipo === "rodar" && a.id === "r01-decisao-talvez").variar;
  assert.equal(talvez.arquivo, undefined);
  assert.deepEqual(talvez.opcoes.map((o) => [o.comando.includes(o.rotulo), o.saida.at(-1).l]),
    [[true, "responder"], [true, "ValueError: 'RESPONDER' is not a valid Decisao"]]);
});

test("a aba de problemas sai da saída gravada: arquivo e linha quando a saída diz, só a mensagem quando não diz", () => {
  const de = (id) => acoes.find((a) => a.tipo === "rodar" && a.id === id).problemas;
  assert.deepEqual(de("r01-testes-pegam-o-r12").map((p) => `${p.arquivo}:${p.linha}`), ["test_referencia.py:36", "test_referencia.py:41"]);
  assert.match(de("r01-testes-pegam-o-r12")[0].mensagem, /R12: o e-mail não é do dono do pedido/);
  assert.deepEqual(de("r01-caso-sem-pedido-barrado").map((p) => [p.arquivo, p.linha]), [["contrato.py", 56]]);   // o .venv é biblioteca, fica de fora
  assert.deepEqual(de("r01-decisao-talvez"), [{ mensagem: "ValueError: 'talvez' is not a valid Decisao" }]);
  assert.deepEqual(de("r01-testes-passam"), []);
});

test("as dúvidas chegam às ações do roteiro, no máximo duas, cada uma com resposta", () => {
  const com = acoes.map((a, k) => [k, a]).filter(([, a]) => a.duvidas);
  assert.deepEqual(com.map(([k, a]) => [k, a.duvidas.length]), [[4, 2], [5, 1], [11, 1], [20, 1], [33, 1], [39, 2]]);
  assert.ok(com.every(([, a]) => a.duvidas.every((d) => d.pergunta.endsWith("?") && d.resposta.length > 40)));
  assert.match(acoes[39].duvidas[0].resposta, /5 das 20/);
});

test("o livro não monta com dúvida demais numa ação", async () => {
  const muito = entrada(); muito.roteiro.passos[4].duvidas = [1, 2, 3].map((n) => ({ pergunta: `Dúvida ${n}?`, resposta: "uma resposta" }));
  await assert.rejects(montarIde(muito), /no máximo duas/);
});

test("a pasta do projeto vem do livro: sem ela, a IDE não monta", async () => {
  const sem = entrada(); delete sem.pasta;
  await assert.rejects(montarIde(sem), /falta a pasta do projeto/);
});
