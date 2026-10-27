/**
 * A ilha do mapa do ciclo animado (docs/capacidades/ciclo-animado.md): a composição (CicloAnimado.tsx), que o leitor toca
 * ou rola com a página, como as outras figuras (palco/RolaCena.tsx; docs/capacidades/mapa-do-ciclo-rola.md). O palpite em cada problema é lido da
 * caixa da página (Aposta.astro), ao carregar e a cada clique nela: quem já deu o palpite lê o caminho, e não a pergunta. A
 * fase por onde o problema passa acende o cartão dela, e clicar num nó do vídeo abre o cartão: a ilha só avisa a figura
 * (evento "ciclo:fase"), e o MapaDoCiclo acende. Sem JS, fica o mapa parado.
 */
import { type MouseEvent, useEffect, useMemo, useRef, useState } from "react";
import RolaCena from "../palco/RolaCena";
import { useDireto } from "../palco/direto";
import type { Desenho } from "./Anel";
import { CicloAnimado, quadroDoCiclo } from "./CicloAnimado";
import { type Entrada, FPS, faseAcesa, jaSabe, legenda, montarCenas } from "./cenas";

// a aposta da página com os mesmos problemas: o índice da opção que o leitor marcou em cada um, ou null
const lerApostas = (aposta: Entrada["aposta"]) => {
  const textos = aposta.mensagens.map((m) => (m.texto ?? "").trim());
  const caixa = [...document.querySelectorAll<HTMLElement>("[data-aposta]")]
    .find((a) => [...a.querySelectorAll(".apo-msg q")].map((q) => q.textContent?.trim()).join("|") === textos.join("|"));
  if (!caixa) return aposta.mensagens.map(() => null);
  return [...caixa.querySelectorAll(".apo-msg")].map((msg) => {
    const marcado = msg.querySelector<HTMLElement>('button[aria-pressed="true"]');
    return marcado ? Number(marcado.dataset.j) : null;
  });
};

const estreito = () => matchMedia("(max-width: 640px)").matches;

export default function FiguraCiclo({ ciclo, cenas, aposta }: Entrada) {
  const caixa = useRef<HTMLDivElement>(null);
  const direto = useDireto();
  const m = useMemo(() => montarCenas({ ciclo, cenas, aposta }), [ciclo, cenas, aposta]);
  const [desenho, setDesenho] = useState<Desenho>("anel");
  const [apostas, setApostas] = useState<(number | null)[]>(() => aposta.mensagens.map(() => null));
  const acesa = useRef<string | undefined>(undefined);
  const q = useMemo(() => quadroDoCiclo({ ciclo, cenas, aposta }, desenho), [ciclo, cenas, aposta, desenho]);
  const sabe = jaSabe(apostas, direto);
  const props = useMemo(() => ({ ciclo, cenas, aposta, desenho, apostas, sabe }), [ciclo, cenas, aposta, desenho, apostas, sabe]);

  /* o palpite do leitor: o que já está marcado quando a ilha carrega, e cada clique na caixa depois */
  useEffect(() => {
    setApostas(lerApostas(aposta));
    const clique = (e: Event) => { if ((e.target as Element).closest?.("[data-aposta] .apo-opcoes button")) setApostas(lerApostas(aposta)); };
    document.addEventListener("click", clique);
    return () => document.removeEventListener("click", clique);
  }, [aposta]);

  /* a figura passa a mostrar o vídeo no lugar do mapa parado; e escolhe anel ou coluna pela largura */
  useEffect(() => {
    const fig = caixa.current?.closest<HTMLElement>("[data-mapa-ciclo]");
    fig?.setAttribute("data-animado", "");
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(estreito() ? "coluna" : "anel");
    troca(); mq.addEventListener("change", troca);
    return () => { fig?.removeAttribute("data-animado"); mq.removeEventListener("change", troca); };
  }, []);

  /* avisa a figura de qual fase acender (o cartão), só quando ela muda */
  const avisar = (id: string | undefined, abrir = false) => {
    if (!id || (id === acesa.current && !abrir)) return;
    acesa.current = id;
    caixa.current?.closest("[data-mapa-ciclo]")?.dispatchEvent(new CustomEvent("ciclo:fase", { detail: { id, abrir } }));
  };

  /* clicar num nó do vídeo abre o cartão dele */
  const clicar = (e: MouseEvent) => {
    const no = (e.target as Element).closest<SVGGElement>("[data-no]");
    if (no?.dataset.no) avisar(no.dataset.no, true);
  };

  return <div ref={caixa} className="mc-video" onClick={clicar}>
    <RolaCena chave={desenho} component={CicloAnimado} inputProps={props} duracao={q.duracao} fps={q.fps} largura={q.largura} altura={q.altura}
      telas={9} reserva={desenho === "coluna" ? 100 : 110} aoQuadro={(f) => avisar(faseAcesa(m, f / FPS))}
      descricao={<ol>{m.cenas.map((c, k) => <li key={k}>{legenda(c, sabe)}</li>)}</ol>} />
  </div>;
}
