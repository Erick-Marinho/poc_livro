/**
 * A figura 1.1 (docs/capacidades/laco-do-agente.md): quem decide o próximo passo, com o leitor no papel de cada jeito
 * de usar um modelo, uma rodada por vez (docs/PRINCIPIOS.md: o leitor aprende com o que faz). 1. Só o modelo: ele prevê
 * o que o modelo responde sem ver o sistema, e vê a data inventada. 2. Fluxo fixo: executa o roteiro do código com o
 * pedido (dá certo) e, depois de prever, com a frigideira (para no passo 1). 3. Agente: no papel do modelo, escolhe
 * cada passo, vê o que voltou e decide de novo, até responder; embaixo, o laço que ele fez. No fim, quem decide em cada
 * jeito. As respostas e os resultados vêm dos três jeitos (quemDecide.ts). Com menos movimento, nada desliza; no modo
 * direto, só o fim. Sem JS, fica a figura em texto (FiguraLaco.astro).
 */
import { Brain, Check, Code, Lock, MessageSquare, RotateCcw, Wrench, X } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDireto } from "../palco/direto";
import { agir, type Entrada, inicio, montarRodadas, type Resposta, type Trilha } from "./quemDecide";

const menos = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const espera = (ms: number) => new Promise((ok) => setTimeout(ok, menos() ? 0 : ms));

const Marca = ({ certo }: { certo: boolean }) => (
  <span className={`qd-marca ${certo ? "qd-certo" : "qd-erro"}`} aria-label={certo ? "certo" : "errado"}>{certo ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}</span>
);

const Mensagem = ({ cliente, texto }: { cliente: string; texto: string }) => (
  <div className="qd-msg qd-entra"><span className="qd-quem">{cliente} escreve:</span>“{texto}”</div>
);

// a resposta que chega para a cliente: certa (verde) ou errada (âmbar), com o porquê
const Respondeu = ({ r }: { r: Resposta }) => (
  <div className={`qd-resposta qd-entra ${r.certo ? "qd-certo" : "qd-erro"}`}>
    <span className="qd-quem"><MessageSquare size={14} /> resposta</span>
    <span>“{r.texto}”</span>
    <span className="qd-porque"><Marca certo={r.certo} /> {r.certo ? "veio dos dados da loja" : r.erro}</span>
  </div>
);

// uma pergunta antes de ver: as opções viram certo ou errado quando o leitor escolhe
function Prever({ pergunta, opcoes, certa, escolha, escolher }: { pergunta: string; opcoes: string[]; certa: number; escolha: number | null; escolher: (k: number) => void }) {
  return (
    <div className="qd-prever qd-entra" role="group" aria-label={pergunta}>
      <b>{pergunta}</b>
      <div className="qd-opcoes">
        {opcoes.map((o, k) => {
          const feito = escolha !== null;
          const estado = !feito ? "" : k === certa ? "qd-certo" : k === escolha ? "qd-erro" : "qd-apagada";
          return <button key={o} type="button" disabled={feito} className={estado} onClick={() => escolher(k)}>{o}{feito && k === certa ? <Check size={14} strokeWidth={3} /> : null}</button>;
        })}
      </div>
    </div>
  );
}

const Licao = ({ texto, seguir, rotulo }: { texto: string; seguir?: () => void; rotulo?: string }) => (
  <div className="qd-licao qd-entra">
    <p>{texto}</p>
    {seguir ? <button type="button" className="qd-seguir" onClick={seguir}>{rotulo}</button> : null}
  </div>
);

export default function QuemDecide(props: Entrada) {
  const r = useMemo(() => montarRodadas(props), [props]);
  const direto = useDireto();
  const [rodada, setRodada] = useState(0); // 0, 1, 2; 3 é o fim
  const [anuncio, setAnuncio] = useState("");
  const topo = useRef<HTMLDivElement>(null);

  // 1. só o modelo
  const [prevModelo, setPrevModelo] = useState<number | null>(null);
  const [escreveu, setEscreveu] = useState(false);
  // 2. fluxo fixo: quantos passos do roteiro já rodaram, com o pedido e com a frigideira
  const [rodouPedido, setRodouPedido] = useState(-1); // -1: não começou
  const [viuPedido, setViuPedido] = useState(false); // o leitor viu o pedido dar certo e pediu a outra pergunta
  const [prevFluxo, setPrevFluxo] = useState<number | null>(null);
  const [rodouProduto, setRodouProduto] = useState(-1);
  // 3. agente
  const [trilha, setTrilha] = useState<Trilha>(inicio());

  const ir = (k: number) => { setRodada(k); topo.current?.scrollIntoView({ block: "nearest", behavior: menos() ? "auto" : "smooth" }); };

  const preverModelo = async (k: number) => {
    setPrevModelo(k);
    await espera(900);
    setEscreveu(true);
    setAnuncio(`O modelo respondeu: ${r.modelo.resposta.texto} Errado: ${r.modelo.resposta.erro}.`);
  };
  const rodar = async (passos: number, marcar: (n: number) => void, fim: string) => {
    for (let n = 0; n <= passos; n++) { marcar(n); await espera(850); }
    setAnuncio(fim);
  };
  const executarPedido = () => rodar(r.fluxo.pedido.passos.length, setRodouPedido, `O roteiro foi até o fim. ${r.fluxo.pedido.resposta.texto} Certo.`);
  const preverFluxo = async (k: number) => {
    setPrevFluxo(k);
    await espera(500);
    rodar(r.fluxo.produto.passos.length, setRodouProduto, `O roteiro parou no passo ${r.fluxo.produto.passos.length}. ${r.fluxo.produto.resposta.texto} Errado.`);
  };
  const escolher = (id: string) => {
    const t = agir(r.agente, trilha, id);
    setTrilha(t);
    const ultimo = t.passos[t.passos.length - 1];
    setAnuncio(t.resposta ? `Você respondeu: ${t.resposta.texto} ${t.resposta.certo ? "Certo." : `Errado: ${t.resposta.erro}.`}` : `${ultimo.rotulo}: ${ultimo.resultado}`);
  };

  useEffect(() => { if (direto) setRodada(3); }, [direto]);

  /* a figura passa a mostrar a ilha, e a versão em texto se fecha (sem JS, ela é a figura) */
  useEffect(() => {
    const fig = topo.current?.closest<HTMLElement>("figure[data-laco]");
    fig?.setAttribute("data-animado", "");
    const texto = fig?.querySelector<HTMLDetailsElement>("details.laco-texto");
    if (texto) texto.open = false;
    return () => fig?.removeAttribute("data-animado");
  }, []);

  const passos = [r.modelo.titulo, r.fluxo.titulo, r.agente.titulo];

  return (
    <div className="qd" ref={topo}>
      <div className="qd-cabeca">
        <span className="qd-titulo">{r.pergunta}</span>
        <span className="qd-etiqueta">ilustração · você decide</span>
      </div>
      {/* as três rodadas: a de agora acesa; as feitas, com ✓ */}
      <ol className="qd-rodadas" aria-label="os três jeitos">
        {passos.map((p, k) => (
          <li key={p} aria-current={k === rodada ? "true" : undefined} className={k === rodada ? "qd-agora" : k < rodada || rodada === 3 ? "qd-feita" : ""}>
            <span className="qd-num">{k < rodada || rodada === 3 ? <Check size={12} strokeWidth={3} /> : k + 1}</span>{p}
          </li>
        ))}
      </ol>

      {rodada === 0 ? (
        <section className="qd-rodada" key="modelo">
          <p className="qd-intro">{r.modelo.intro}</p>
          <Mensagem cliente={r.modelo.cliente} texto={r.modelo.mensagem} />
          <div className="qd-trancado"><Brain size={15} /> o modelo <span className="qd-seta">⇢</span> <Lock size={14} /> o sistema da loja: fora do alcance</div>
          <Prever {...r.modelo.prever} escolha={prevModelo} escolher={preverModelo} />
          {prevModelo !== null && !escreveu ? <div className="qd-digitando" aria-hidden="true"><Brain size={14} /> o modelo escreve<span>.</span><span>.</span><span>.</span></div> : null}
          {escreveu ? <><Respondeu r={r.modelo.resposta} /><Licao texto={r.modelo.licao} seguir={() => ir(1)} rotulo="Próximo jeito: fluxo fixo →" /></> : null}
        </section>
      ) : null}

      {rodada === 1 ? (
        <section className="qd-rodada" key="fluxo">
          <p className="qd-intro">{r.fluxo.intro}</p>
          {/* uma execução aberta por vez: com a frigideira, a do pedido vira uma linha */}
          {viuPedido ? (
            <div className="qd-feito qd-entra"><Marca certo={r.fluxo.pedido.resposta.certo} /> com o pedido, o roteiro foi até o fim: “{r.fluxo.pedido.resposta.texto}”</div>
          ) : null}
          {[viuPedido ? { e: r.fluxo.produto, rodou: rodouProduto, i: 1 } : { e: r.fluxo.pedido, rodou: rodouPedido, i: 0 }].map(({ e, rodou, i }) => (
            <div key={i} className="qd-execucao qd-entra">
              <Mensagem cliente={e.cliente} texto={e.mensagem} />
              {/* com a frigideira, o leitor prevê antes de o roteiro executar */}
              {i === 1 ? <Prever {...r.fluxo.prever} escolha={prevFluxo} escolher={preverFluxo} /> : null}
              {i === 0 || prevFluxo !== null ? (
                <ol className="qd-roteiro">
                  {r.fluxo.roteiro.map((passo, n) => {
                    const feito = rodou > n && n < e.passos.length;
                    const parou = rodou >= e.passos.length && n === e.passos.length - 1 && !e.resposta.certo;
                    const nem = rodou >= e.passos.length && n >= e.passos.length;
                    return (
                      <li key={passo} className={parou ? "qd-erro" : feito ? "qd-certo" : nem ? "qd-apagada" : ""}>
                        <span className="qd-quem">{n === 1 ? <Wrench size={13} /> : n === 2 ? <Brain size={13} /> : <Code size={13} />}</span>
                        <span>{passo}</span>
                        {feito && e.passos[n].resultado ? <span className="qd-volta">→ {e.passos[n].resultado}</span> : null}
                        {feito ? <Marca certo={!parou} /> : nem ? <span className="qd-volta">não chega aqui</span> : null}
                      </li>
                    );
                  })}
                </ol>
              ) : null}
              {i === 0 && rodou < 0 ? <button type="button" className="qd-executar" onClick={executarPedido}>▶ Executar o roteiro</button> : null}
              {rodou >= e.passos.length ? <Respondeu r={e.resposta} /> : null}
              {i === 0 && rodou >= e.passos.length ? <button type="button" className="qd-seguir qd-entra" onClick={() => setViuPedido(true)}>Outra pergunta, o mesmo roteiro →</button> : null}
            </div>
          ))}
          {rodouProduto >= r.fluxo.produto.passos.length ? <Licao texto={r.fluxo.licao} seguir={() => ir(2)} rotulo="Por último: você é o agente →" /> : null}
        </section>
      ) : null}

      {rodada === 2 ? (
        <section className="qd-rodada" key="agente">
          <p className="qd-intro">{r.agente.intro}</p>
          <Mensagem cliente={r.agente.cliente} texto={r.agente.mensagem} />
          {/* o que o leitor já fez: cada ação e o que voltou */}
          {trilha.passos.map((p, i) => (
            <div key={i} className="qd-acao qd-entra">
              <span className="qd-quem"><Wrench size={13} /> {p.rotulo}</span>
              <span className="qd-volta">→ {p.resultado}</span>
            </div>
          ))}
          {trilha.resposta ? <Respondeu r={trilha.resposta} /> : (
            <div className="qd-decidir qd-entra" role="group" aria-label="o seu próximo passo">
              <b>{trilha.passos.length ? "Você viu o que voltou. Decida de novo:" : "Você é o modelo. Qual é o próximo passo?"}</b>
              <div className="qd-opcoes">
                {r.agente.acoes.map((a) => <button key={a.id} type="button" onClick={() => escolher(a.id)}>{a.rotulo}</button>)}
              </div>
            </div>
          )}
          {/* o laço que o leitor fez */}
          {trilha.passos.length || trilha.resposta ? (
            <div className="qd-laco qd-entra" aria-label="o laço que você fez">
              <span className="qd-laco-titulo">o laço que você fez</span>
              <span className="qd-elos">
                {trilha.passos.map((p, i) => <span key={i}><i>decidir</i> → <i>agir: {p.rotulo}</i> → <i>observar</i> → </span>)}
                <i>decidir</i>{trilha.resposta ? <> → <i className={trilha.resposta.certo ? "qd-certo" : "qd-erro"}>responder</i></> : " …"}
              </span>
            </div>
          ) : null}
          {trilha.resposta && !trilha.resposta.certo ? (
            <div className="qd-licao qd-entra">
              <p>Você respondeu sem olhar o sistema: é o que o modelo sozinho faz.</p>
              <button type="button" className="qd-seguir" onClick={() => setTrilha(inicio())}><RotateCcw size={14} /> Decidir de novo</button>
            </div>
          ) : null}
          {trilha.resposta?.certo ? <Licao texto={r.agente.licao} seguir={() => ir(3)} rotulo="Ver quem decide em cada jeito →" /> : null}
        </section>
      ) : null}

      {rodada === 3 ? (
        <section className="qd-rodada qd-fim" key="fim">
          {r.fim.map((f) => (
            <div key={f.jeito} className="qd-linha qd-entra">
              <b>{f.nome}</b>
              <span>{f.quem}</span>
              <span className="qd-acertos">{f.acertos.map((a, i) => <span key={i}><Marca certo={a} /> {i === 0 ? "pedido" : "frigideira"}</span>)}</span>
            </div>
          ))}
          {!direto ? (
            <button type="button" className="qd-seguir" onClick={() => { setPrevModelo(null); setEscreveu(false); setRodouPedido(-1); setViuPedido(false); setPrevFluxo(null); setRodouProduto(-1); setTrilha(inicio()); ir(0); }}>
              <RotateCcw size={14} /> Recomeçar
            </button>
          ) : null}
        </section>
      ) : null}

      <span className="qd-anuncio" aria-live="polite">{anuncio}</span>
    </div>
  );
}
