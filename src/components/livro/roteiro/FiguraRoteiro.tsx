/**
 * A ilha do roteiro do substituto, no 2.1 (docs/capacidades/capitulo-2-em-cenas.md, etapa 1): a animação
 * (RoteiroAnimado.tsx) sobre a base das animações (palco/AvancaCena.tsx). A primeira cena traz a mensagem até o
 * substituto; aí a pergunta aparece logo embaixo do vídeo, e escolher o balcão já toca a cena seguinte. Rolar a página
 * também avança: a figura fica presa na tela enquanto o leitor rola, e cada trecho da rolagem pede a cena seguinte
 * (nada toca sozinho; quem rola é o leitor). No modo direto, sem pergunta nem rolagem: o quadro final, que é o grafo.
 */
import { useEffect, useMemo, useRef, useState } from "react";
import AvancaCena from "../palco/AvancaCena";
import { useDireto } from "../palco/direto";
import { CENAS, curta, DURACAO, type Entrada, FPS, legenda, montarRoteiro } from "./roteiro.ts";
import { type Desenho, MEDIDAS, RoteiroAnimado, Veredito } from "./RoteiroAnimado";

export default function FiguraRoteiro(entrada: Entrada) {
  const r = useMemo(() => montarRoteiro(entrada), [entrada]);
  const direto = useDireto();
  const trilho = useRef<HTMLDivElement>(null);
  const [escolha, setEscolha] = useState<string | null>(null);
  const [visto, setVisto] = useState({ cena: -1, tocando: false });
  const [pedido, setPedido] = useState<{ cena: number; vez: number } | undefined>(undefined);
  const cortes = useMemo(() => CENAS.map((c) => ({ de: Math.round(c.de * FPS), ate: Math.round(c.ate * FPS) - 1 })), []);
  /* o desenho pela largura: no celular, o estreito, com a legenda fora do vídeo */
  const [desenho, setDesenho] = useState<Desenho>("largo");
  useEffect(() => {
    const mq = matchMedia("(max-width: 640px)");
    const troca = () => setDesenho(mq.matches ? "estreito" : "largo");
    troca(); mq.addEventListener("change", troca);
    return () => mq.removeEventListener("change", troca);
  }, []);
  const M = MEDIDAS[desenho];
  const props = useMemo(() => ({ roteiro: r, escolha: escolha === "pulou" ? null : escolha, desenho }), [r, escolha, desenho]);
  const a = r.mensagens[0];
  const pedir = (cena: number) => setPedido((p) => (p && p.cena >= cena ? p : { cena, vez: (p?.vez ?? 0) + 1 }));

  /* a rolagem: o trilho tem um trecho por cena; passar de um trecho pede a cena dele */
  useEffect(() => {
    if (direto) return;
    const rolar = () => {
      const t = trilho.current;
      if (!t) return;
      const caixa = t.getBoundingClientRect();
      const percorrido = -caixa.top + innerHeight * 0.35;
      if (percorrido < 0) return;
      const trecho = (caixa.height - innerHeight * 0.65) / CENAS.length;
      pedir(Math.min(CENAS.length - 1, Math.floor(percorrido / trecho)));
    };
    addEventListener("scroll", rolar, { passive: true });
    return () => removeEventListener("scroll", rolar);
  }, [direto]);

  const escolher = (id: string) => { setEscolha(id); pedir(1); };
  const perguntar = !direto && escolha === null && visto.cena >= 0 && !visto.tocando;
  const pergunta = perguntar ? (
    <div className="rt-pergunta" role="group" aria-label="Escolha o balcão">
      <p><span className="rt-rotulo">sua vez</span>Para qual balcão o substituto manda <q>{curta(a.pergunta)}</q>?</p>
      <div className="rt-opcoes">
        {r.balcoes.map((b) => <button key={b.id} type="button" onClick={() => escolher(b.id)}>{b.rotulo}</button>)}
        <button type="button" className="rt-pular" onClick={() => escolher("pulou")}>só mostrar</button>
      </div>
    </div>
  ) : null;

  const cenaVista = Math.max(0, visto.cena);
  const fora = desenho === "estreito" && !perguntar ? (
    <div className="rt-legenda" aria-hidden="true">
      <p>{legenda(r, cenaVista)}</p>
      {cenaVista === 1 && !visto.tocando && escolha && escolha !== "pulou" ? <Veredito r={r} escolha={escolha} certa={a.balcao} fonte={14} /> : null}
    </div>
  ) : null;

  return <div ref={trilho} className="rt-trilho" style={direto ? undefined : { height: `${(CENAS.length + 1) * 75}vh` }}>
    <div className="rt">
      <div className="rt-video" style={{ width: `min(100%, calc((100vh - ${desenho === "estreito" ? 320 : 250}px) * ${M.w / M.h}))` }}>
        <AvancaCena chave={desenho} component={RoteiroAnimado} inputProps={props} duracao={DURACAO} fps={FPS} largura={M.w} altura={M.h}
          cortes={cortes} primeiro="▶ Ver a mensagem chegar (ou role a página)" trava={escolha === null ? { cena: 1, texto: "Escolha o balcão acima" } : undefined}
          irPara={pedido} abaixo={<>{fora}{pergunta}</>} aoMudar={(cena, tocando) => setVisto({ cena, tocando })} anuncio={(k) => legenda(r, k)} />
      </div>
    </div>
  </div>;
}
