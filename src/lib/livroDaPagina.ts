/**
 * O livro de uma página e o que os dados dele dizem (docs/capacidades/varios-livros.md). O livro é o primeiro pedaço do
 * endereço (/<livro>/<capítulo>/), ou o experimento, em /experimentos/<experimento>/ (que tem a IDE do mesmo jeito), ou o rascunho de um
 * experimento, em /rascunhos/<experimento>/ (só no astro dev; docs/capacidades/experimento-pausa-e-fluxo.md); a pasta do projeto vem
 * do comandos.json dele, e o nome da loja, dos dados do projeto.
 * Faltando um dos dois, o build falha com o nome do livro. Só os componentes .astro usam isto.
 */
const comandos = import.meta.glob<{ pasta_do_leitor: string }>(["../../livros/*/comandos.json", "../../experimentos/*/comandos.json", "../../rascunhos/*/comandos.json"], { eager: true, import: "default" });
const lojas = import.meta.glob<{ nome: string }>("../../livros/*/projeto/dados/loja.json", { eager: true, import: "default" });

/** "ciclo-de-vida", ou "experimentos/<experimento>" (ou "rascunhos/<experimento>") numa página de experimento */
export const livroDe = (url: URL) => { const p = url.pathname.split("/").filter(Boolean); return p[0] === "experimentos" || p[0] === "rascunhos" ? `${p[0]}/${p[1]}` : p[0] ?? ""; };

function doLivro<T>(mapa: Record<string, T>, url: URL, oQue: string): T {
  const livro = livroDe(url);
  const achado = Object.entries(mapa).find(([caminho]) => caminho.includes(livro.includes("/") ? `/${livro}/` : `/livros/${livro}/`));
  if (!achado) throw new Error(`livro "${livro}" (${url.pathname}): falta ${oQue}`);
  return achado[1];
}

/** a pasta do projeto como o leitor a vê: /home/voce/x vira ~/x */
export const pastaDoLeitor = (url: URL) => doLivro(comandos, url, "o comandos.json com a pasta_do_leitor").pasta_do_leitor.replace(/^\/home\/voce/, "~");
export const nomeDaLoja = (url: URL) => doLivro(lojas, url, "o projeto/dados/loja.json com o nome da loja").nome;
