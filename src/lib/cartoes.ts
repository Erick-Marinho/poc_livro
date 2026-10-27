/**
 * As perguntas em cartões, uma por vez (docs/capacidades/capitulo-1-dinamicas.md, etapa 5): uma lista de perguntas de
 * um componente (PrimeiroDia, Aposta, Troca) vira cartões, um visível por vez, cada um com a sua altura. O
 * leitor responde, o retorno aparece no cartão (o do componente) e surge "próxima →"; o próximo entra deslizando da
 * direita. Embaixo, a conta e um ponto por cartão, para voltar. Quem diz se um cartão foi respondido é o componente;
 * os cartões só olham a classe dele. Sem JavaScript e no modo direto (só CSS), a lista fica inteira.
 */
import "../styles/cartoes.css";

export function emCartoes(raiz: HTMLElement, itens: HTMLElement[], respondido: (item: HTMLElement) => boolean) {
  if (itens.length < 2) return { ir: () => {} };
  const pai = itens[0].parentElement!;
  /* numa lista (ol/ul), a própria lista é o trilho; senão, os itens entram numa caixa nova, no mesmo lugar */
  const trilho = /^(OL|UL)$/.test(pai.tagName) ? pai : pai.insertBefore(document.createElement("div"), itens[0]);
  if (trilho !== pai) itens.forEach((x) => trilho.appendChild(x));
  trilho.classList.add("cartoes-trilho");
  raiz.classList.add("em-cartoes");

  const nav = document.createElement("div");
  nav.className = "cartoes-nav";
  nav.innerHTML = `<span class="cartoes-conta" aria-live="polite"></span><span class="cartoes-pontos"></span><button type="button" class="cartoes-proxima">próxima →</button>`;
  trilho.after(nav);
  const conta = nav.querySelector<HTMLElement>(".cartoes-conta")!;
  const proxima = nav.querySelector<HTMLButtonElement>(".cartoes-proxima")!;
  const pontos = itens.map((_, k) => {
    const b = document.createElement("button");
    b.type = "button"; b.className = "cartoes-ponto"; b.setAttribute("aria-label", `pergunta ${k + 1}`);
    b.addEventListener("click", () => ir(k));
    nav.querySelector(".cartoes-pontos")!.appendChild(b);
    return b;
  });

  let atual = 0;
  const atualizar = () => {
    const primeiraAberta = itens.findIndex((x) => !respondido(x));
    conta.textContent = `${atual + 1} de ${itens.length}`;
    pontos.forEach((b, k) => {
      b.classList.toggle("visto", respondido(itens[k]));
      b.setAttribute("aria-current", String(k === atual));
      /* volta para qualquer um; adiante, só até a primeira ainda sem resposta */
      b.disabled = primeiraAberta >= 0 && k > primeiraAberta;
    });
    proxima.hidden = !(respondido(itens[atual]) && atual < itens.length - 1);
  };
  const ir = (k: number) => {
    const de = atual;
    atual = Math.max(0, Math.min(itens.length - 1, k));
    itens.forEach((x, j) => x.classList.toggle("cartao-atual", j === atual));
    const item = itens[atual];
    item.classList.remove("cartao-vem-dir", "cartao-vem-esq");
    if (atual !== de) { void item.offsetWidth; item.classList.add(atual > de ? "cartao-vem-dir" : "cartao-vem-esq"); }
    atualizar();
  };
  proxima.addEventListener("click", () => ir(atual + 1));

  /* respondeu: aparece "próxima →", com o foco nela, sem rolar a página */
  const observador = new MutationObserver(() => {
    const antes = proxima.hidden;
    atualizar();
    if (antes && !proxima.hidden) proxima.focus({ preventScroll: true });
  });
  itens.forEach((x) => observador.observe(x, { attributes: true, attributeFilter: ["class"] }));
  ir(0);
  return { ir };
}
