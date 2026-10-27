/**
 * A figura 1.1 (docs/capacidades/laco-do-agente.md): três histórias de atendentes da loja, em quadrinhos, para quem
 * começa do zero. Um quadro por vez, no ritmo do leitor ("Continuar"), sem jargão; o nome técnico só no fim de cada
 * história. 1. O atendente sem acesso ao sistema: o leitor prevê o que ele responde, e ele chuta. 2. O atendente com a
 * ficha: com o pedido, a ficha dá certo; com a frigideira, o leitor prevê, e a ficha trava no passo 1, porque não prevê
 * pergunta de produto. 3. A atendente é o leitor: escolhe onde olhar, vê o resultado e decide de novo, até responder. No
 * fim, quem decide em cada história, e onde a comparação quebra. Os fatos vêm dos três jeitos (quemDecide.ts). Com menos
 * movimento, nada desliza; no modo direto, só o fim.
 */
import { ArrowRight, BookOpen, Check, ClipboardList, Hand, Headset, Lock, MessageCircle, Monitor, RotateCcw, UserRound, X } from "lucide-react";
import { type ReactNode, useEffect, useMemo, useRef, useState } from "react";
import { useDireto } from "../palco/direto";
import { agir, type Entrada, inicio, montarHistorias, type Resposta, type Seguiu, type Trilha } from "./quemDecide";

const menos = () => typeof matchMedia !== "undefined" && matchMedia("(prefers-reduced-motion: reduce)").matches;
const espera = (ms: number) => new Promise((ok) => setTimeout(ok, menos() ? 0 : ms));

const Marca = ({ certo }: { certo: boolean }) => (
  <span className={`qd-marca ${certo ? "qd-certo" : "qd-erro"}`} aria-label={certo ? "certo" : "errado"}>{certo ? <Check size={13} strokeWidth={3} /> : <X size={13} strokeWidth={3} />}</span>
);

// um quadro: quem fala (o ícone e o nome) e o balão
const Quadro = ({ icone, quem, children, tom = "" }: { icone: ReactNode; quem: string; children: ReactNode; tom?: string }) => (
  <div className={`qd-quadro qd-entra ${tom}`}>
    <span className="qd-avatar" aria-hidden="true">{icone}</span>
    <div className="qd-balao"><span className="qd-quem">{quem}</span>{children}</div>
  </div>
);

const Cliente = ({ nome, texto }: { nome: string; texto: string }) => <Quadro icone={<UserRound size={20} />} quem={nome}>“{texto}”</Quadro>;
const Responde = ({ quem, r, icone = <Headset size={20} /> }: { quem: string; r: Resposta; icone?: ReactNode }) => (
  <Quadro icone={icone} quem={quem} tom={r.certo ? "qd-certo" : "qd-erro"}>
    “{r.texto}”
    <span className="qd-porque"><Marca certo={r.certo} /> {r.certo ? "certo: veio dos dados da loja" : r.erro}</span>
  </Quadro>
);

// uma pergunta antes de ver: as opções viram certo ou errado quando o leitor escolhe
function Prever({ pergunta, opcoes, certa, escolha, escolher }: { pergunta: string; opcoes: string[]; certa: number; escolha: number | null; escolher: (k: number) => void }) {
  return (
    <div className="qd-prever qd-entra" role="group" aria-label={pergunta}>
      <b><Hand size={16} /> Você prevê: {pergunta}</b>
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

// a ficha: os passos, e, quando o atendente segue, o que ele achou em cada um
function Ficha({ ficha, seguiu, ate, titulo }: { ficha: string[]; seguiu?: Seguiu; ate?: number; titulo: string }) {
  return (
    <div className="qd-ficha qd-entra">
      <span className="qd-quem"><ClipboardList size={15} /> {titulo}</span>
      <ol>
        {ficha.map((p, n) => {
          const feito = seguiu && ate !== undefined && ate > n && n < seguiu.passos.length;
          const travou = seguiu && ate !== undefined && ate >= seguiu.passos.length && n === seguiu.passos.length - 1 && !seguiu.resposta.certo;
          const nem = seguiu && ate !== undefined && ate >= seguiu.passos.length && n >= seguiu.passos.length;
          return (
            <li key={p} className={travou ? "qd-erro" : feito ? "qd-certo" : nem ? "qd-apagada" : ""}>
              <span>{p}</span>
              {feito && seguiu.passos[n].achou ? <span className="qd-achou">→ {seguiu.passos[n].achou}</span> : null}
              {feito ? <Marca certo={!travou} /> : null}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// o fim de cada história: o que aconteceu, e o nome técnico disso
const Nome = ({ conclusao, nome, explica, seguir, rotulo }: { conclusao: string; nome: string; explica: string; seguir: () => void; rotulo: string }) => (
  <div className="qd-nome qd-entra">
    <p className="qd-conclusao">{conclusao}</p>
    <p className="qd-tecnico"><b>{nome}:</b> {explica}</p>
    <button type="button" className="qd-seguir" onClick={seguir}>{rotulo} <ArrowRight size={15} /></button>
  </div>
);

export default function QuemDecide(props: Entrada) {
  const h = useMemo(() => montarHistorias(props), [props]);
  const direto = useDireto();
  const [historia, setHistoria] = useState(0); // 0, 1, 2; 3 é o fim
  const [quadro, setQuadro] = useState(0); // quantos quadros da história já apareceram, além do primeiro
  const [anuncio, setAnuncio] = useState("");
  const topo = useRef<HTMLDivElement>(null);
  // 1.
  const [prevModelo, setPrevModelo] = useState<number | null>(null);
  // 2. quantos passos da ficha ele já seguiu, com o pedido e com a frigideira
  const [seguiuPedido, setSeguiuPedido] = useState(-1);
  const [prevFluxo, setPrevFluxo] = useState<number | null>(null);
  const [seguiuProduto, setSeguiuProduto] = useState(-1);
  // 3.
  const [trilha, setTrilha] = useState<Trilha>(inicio());

  useEffect(() => { if (direto) setHistoria(3); }, [direto]);
  /* a figura passa a mostrar a ilha (antes de carregar, ela fica com 1 px) */
  useEffect(() => {
    const fig = topo.current?.closest<HTMLElement>("figure[data-laco]");
    fig?.setAttribute("data-animado", "");
    return () => fig?.removeAttribute("data-animado");
  }, []);

  const mais = () => setQuadro((q) => q + 1);
  const ir = (k: number) => { setHistoria(k); setQuadro(0); topo.current?.scrollIntoView({ block: "nearest", behavior: menos() ? "auto" : "smooth" }); };
  const recomecar = () => { setPrevModelo(null); setSeguiuPedido(-1); setPrevFluxo(null); setSeguiuProduto(-1); setTrilha(inicio()); ir(0); };
  const seguir = async (passos: number, marcar: (n: number) => void, fim: string) => {
    for (let n = 0; n <= passos; n++) { marcar(n); await espera(900); }
    setAnuncio(fim);
  };
  const Continuar = ({ rotulo = "Continuar" }: { rotulo?: string }) => <button type="button" className="qd-continuar qd-entra" onClick={mais}>{rotulo} <ArrowRight size={15} /></button>;

  const m = h.modelo, f = h.fluxo, a = h.agente;
  const titulos = [m.titulo, f.titulo, a.titulo];

  return (
    <div className="qd" ref={topo}>
      <div className="qd-cabeca">
        <span className="qd-titulo">{h.pergunta}</span>
        <span className="qd-etiqueta">ilustração · três histórias</span>
      </div>
      {historia < 3 ? <p className="qd-capitulo">História {historia + 1} de 3 · <b>{titulos[historia]}</b></p> : null}

      {historia === 0 ? (
        <section className="qd-historia" key="modelo">
          <Cliente nome={m.cliente} texto={m.mensagem} />
          {quadro < 1 ? <Continuar /> : null}
          {quadro >= 1 ? (
            <Quadro icone={<Headset size={20} />} quem="O atendente pensa">
              {m.pensa}
              <span className="qd-trancado"><Lock size={13} /> sem acesso ao sistema da loja</span>
            </Quadro>
          ) : null}
          {quadro >= 1 ? <Prever {...m.prever} escolha={prevModelo} escolher={async (k) => { setPrevModelo(k); await espera(700); mais(); setAnuncio(`Ele responde: ${m.resposta.texto} Errado: ${m.resposta.erro}.`); }} /> : null}
          {quadro >= 2 ? <Responde quem="O atendente responde" r={m.resposta} /> : null}
          {quadro >= 2 ? <Nome conclusao={m.conclusao} nome={m.nome} explica={m.explica} seguir={() => ir(1)} rotulo="Próxima história" /> : null}
        </section>
      ) : null}

      {historia === 1 ? (
        <section className="qd-historia" key="fluxo">
          {/* uma pergunta de cada vez: com a frigideira, a do pedido vira uma linha */}
          {quadro >= 3 ? <div className="qd-feito qd-entra"><Marca certo /> Com o pedido, a ficha deu certo: “{f.pedido.resposta.texto}”</div> : null}
          {quadro < 3 ? (
            <>
              <Ficha ficha={f.ficha} titulo={f.ficha_diz} seguiu={f.pedido} ate={seguiuPedido} />
              {quadro < 1 ? <Continuar /> : null}
              {quadro >= 1 ? <Cliente nome={f.pedido.cliente} texto={f.pedido.mensagem} /> : null}
              {quadro === 1 ? <button type="button" className="qd-continuar qd-entra" onClick={async () => { mais(); await seguir(f.pedido.passos.length, setSeguiuPedido, `A ficha foi até o fim. ${f.pedido.resposta.texto} Certo.`); }}>Ver o atendente seguir a ficha <ArrowRight size={15} /></button> : null}
              {quadro >= 2 && seguiuPedido >= f.pedido.passos.length ? <Responde quem="O atendente responde" r={f.pedido.resposta} /> : null}
              {quadro >= 2 && seguiuPedido >= f.pedido.passos.length ? <Continuar rotulo="Chega outra pergunta" /> : null}
            </>
          ) : (
            <>
              <p className="qd-narra qd-entra">{f.outra}</p>
              <Cliente nome={f.produto.cliente} texto={f.produto.mensagem} />
              {/* a ficha à vista antes de prever; depois da escolha, ele a segue ali mesmo */}
              <Ficha ficha={f.ficha} titulo={f.ficha_diz} seguiu={prevFluxo !== null ? f.produto : undefined} ate={seguiuProduto} />
              <Prever {...f.prever} escolha={prevFluxo} escolher={async (k) => { setPrevFluxo(k); await espera(500); await seguir(f.produto.passos.length, setSeguiuProduto, `A ficha travou no passo ${f.produto.passos.length}. ${f.nao_preve}`); }} />
              {seguiuProduto >= f.produto.passos.length ? (
                <>
                  <div className="qd-alerta qd-entra"><ClipboardList size={16} /> {f.nao_preve}</div>
                  <Responde quem="O atendente responde" r={f.produto.resposta} />
                  <Nome conclusao={f.conclusao} nome={f.nome} explica={f.explica} seguir={() => ir(2)} rotulo="Última história: agora é você" />
                </>
              ) : null}
            </>
          )}
        </section>
      ) : null}

      {historia === 2 ? (
        <section className="qd-historia" key="agente">
          <Cliente nome={a.cliente} texto={a.mensagem} />
          {/* o que o leitor já fez: onde olhou e o que viu (enquanto ele escolhe, o último passo fica no painel, e não aqui) */}
          {(trilha.resposta ? trilha.passos : trilha.passos.slice(0, -1)).map((p, i) => (
            <Quadro key={i} icone={p.id === "buscar_produto" ? <BookOpen size={20} /> : <Monitor size={20} />} quem={p.fez}>{p.resultado}</Quadro>
          ))}
          {trilha.resposta ? <Responde quem="Você responde" r={trilha.resposta} icone={<Hand size={20} />} /> : (
            /* a chave muda a cada passo: o painel entra de novo, e o resultado do clique aparece dentro dele, e não só
               no quadro de cima, para o leitor ver que o clique fez alguma coisa */
            <div className="qd-prever qd-entra" key={trilha.passos.length} role="group" aria-label="o que você faz">
              {trilha.passos.length ? (() => { const u = trilha.passos[trilha.passos.length - 1]; return (
                <p className="qd-resultado">{u.id === "buscar_produto" ? <BookOpen size={16} /> : <Monitor size={16} />}<span><b>{u.fez}:</b> {u.resultado}</span></p>
              ); })() : null}
              <b><Hand size={16} /> {trilha.passos.length ? a.de_novo : a.diz}</b>
              <div className="qd-acoes">
                {a.acoes.map((x) => (
                  <button key={x.id} type="button" className={trilha.passos.some((p) => p.id === x.id) ? "qd-feito" : undefined} onClick={() => {
                    const t = agir(a, trilha, x.id);
                    setTrilha(t);
                    const u = t.passos[t.passos.length - 1];
                    setAnuncio(t.resposta ? `Você respondeu: ${t.resposta.texto} ${t.resposta.certo ? "Certo." : `Errado: ${t.resposta.erro}.`}` : `${u.fez}: ${u.resultado}`);
                  }}>
                    {x.id === "consultar_pedido" ? <Monitor size={18} /> : x.id === "buscar_produto" ? <BookOpen size={18} /> : <MessageCircle size={18} />}{x.rotulo}
                    {trilha.passos.some((p) => p.id === x.id) ? <Check size={14} strokeWidth={3} aria-label="já olhou" /> : null}
                  </button>
                ))}
              </div>
            </div>
          )}
          {trilha.resposta && !trilha.resposta.certo ? (
            <div className="qd-nome qd-entra">
              <p className="qd-conclusao">{a.sem_olhar}</p>
              <button type="button" className="qd-seguir" onClick={() => setTrilha(inicio())}><RotateCcw size={14} /> Tentar de novo</button>
            </div>
          ) : null}
          {trilha.resposta?.certo ? (
            <>
              <div className="qd-caminho qd-entra" aria-label={a.caminho}>
                <span className="qd-quem">{a.caminho}</span>
                <span>{trilha.passos.map((p, i) => <span key={i}>decidiu → <b>{p.fez.replace(/^Você /, "")}</b> → viu o resultado → </span>)}decidiu de novo → <b className="qd-ok">respondeu</b></span>
              </div>
              <Nome conclusao={a.conclusao} nome={a.nome} explica={a.explica} seguir={() => ir(3)} rotulo="Então, quem decide?" />
            </>
          ) : null}
        </section>
      ) : null}

      {historia === 3 ? (
        <section className="qd-historia qd-fim" key="fim">
          <p className="qd-capitulo"><b>{h.fim.titulo}</b></p>
          {h.fim.linhas.map((x) => (
            <div key={x.jeito} className="qd-linha qd-entra">
              <span className="qd-avatar" aria-hidden="true">{x.jeito === "modelo" ? <Headset size={18} /> : x.jeito === "fluxo" ? <ClipboardList size={18} /> : <Hand size={18} />}</span>
              <span><span className="qd-linha-quem">{x.quem}</span><b>{x.decide}</b> <span className="qd-linha-nome">({x.nome})</span></span>
              <span className="qd-acertos">{x.acertos.map((c, i) => <span key={i}><Marca certo={c} /> {i === 0 ? "pedido" : "frigideira"}</span>)}</span>
            </div>
          ))}
          <p className="qd-quebra qd-entra">{h.fim.quebra}</p>
          {!direto ? <button type="button" className="qd-seguir" onClick={recomecar}><RotateCcw size={14} /> Ver de novo</button> : null}
        </section>
      ) : null}

      <span className="qd-anuncio" aria-live="polite">{anuncio}</span>
    </div>
  );
}
