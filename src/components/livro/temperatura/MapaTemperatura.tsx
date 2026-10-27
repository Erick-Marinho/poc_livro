import { Player, type PlayerRef } from "@remotion/player";
import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";
import { useEffect, useMemo, useRef, useState } from "react";
import { useDireto } from "../palco/direto";
import { CENAS, DURACAO, FPS, PERGUNTA, POR_CENA, cenaDe, descricao, limitarQuadro,
  montarMapa, muda, numero, token, type Caso, type DadosMapa } from "./mapa";
import "./temperatura.css";

const COR = { texto: "#edf2fa", fraco: "#b3c0d1", linha: "#394b64", azul: "#66b8ff",
  ambar: "#ffc46b", verde: "#77e1b2", fundo: "#101820", cartao: "#172331" };

function Diagrama({ caso, quadro, compacto, teto }: { caso: Caso; quadro: number; compacto: boolean; teto: number }) {
  const cena = cenaDe(quadro);
  const largura = compacto ? 360 : 960, altura = compacto ? 810 : 570;
  const w = compacto ? 328 : 436, h = 318;
  const posicoes = compacto ? [{x:16,y:112},{x:16,y:450}] : [{x:28,y:132},{x:496,y:132}];
  const visivel = (de: number) => interpolate(quadro, [de * POR_CENA, de * POR_CENA + 20], [0,1], {extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  const sobe = interpolate(quadro, [2 * POR_CENA, 2 * POR_CENA + 52], [0,1], {extrapolateLeft:"clamp",extrapolateRight:"clamp"});
  return <svg viewBox={`0 0 ${largura} ${altura}`} width="100%" height="100%" role="img" aria-label={descricao(caso,cena)}>
    <defs><marker id="tz-seta" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto"><path d="M0,0 L8,4 L0,8" fill={COR.azul}/></marker></defs>
    <rect width={largura} height={altura} fill={COR.fundo}/>
    <g fontFamily='"IBM Plex Sans", system-ui, sans-serif' fill={COR.texto}>
      <rect x={largura/2-146} y="16" width="292" height="60" rx="12" fill="#203448" stroke={COR.azul}/>
      <text x={largura/2} y="40" textAnchor="middle" fontSize="14" fill={COR.fraco}>A MESMA ENTRADA</text>
      <text x={largura/2} y="62" textAnchor="middle" fontSize="18">Como está meu pedido?</text>
      {posicoes.map(({x,y}, i) => {
        const e = caso.execucoes[i], vencedor = e.escolha;
        return <g key={e.ordem}>
          <path d={compacto ? (i===0 ? `M180,76 V${y-8}` : `M34,46 H6 V${y+30} H${x-2}`) : `M480,76 V100 H${x+w/2} V${y-8}`}
            fill="none" stroke={COR.azul} strokeWidth="2" markerEnd="url(#tz-seta)"/>
          <rect x={x} y={y} width={w} height={h} rx="14" fill={COR.cartao} stroke={COR.linha}/>
          <text x={x+16} y={y+28} fontSize="17" fontWeight="600">Execução {i+1}</text>
          <text x={x+w-16} y={y+28} textAnchor="end" fontSize="13" fill={COR.fraco}>mesma regra</text>
          <g opacity={visivel(1)}>
            <rect x={x+14} y={y+44} width={w-28} height="53" rx="8" fill="#101b28"/>
            <text x={x+26} y={y+65} fontFamily='"JetBrains Mono", monospace' fontSize={compacto?14:17}>
              {i===0 ? "(1024 + 0,4) + 0,4" : "1024 + (0,4 + 0,4)"}
            </text>
            <text x={x+26} y={y+85} fontSize="13" fill={COR.fraco}>soma guardada: {numero(e.soma)}</text>
          </g>
          <g opacity={visivel(2)}>
            <text x={x+16} y={y+121} fontSize="13" fill={COR.fraco}>Pontuação de cada alternativa</text>
            {[0,1].map(j => {
              const by=y+144+j*45, ganha=cena>=3 && vencedor===j;
              return <g key={j}>
                <rect x={x+9} y={by-8} width={w-18} height="39" rx="6" fill="none" stroke={ganha?COR.verde:"transparent"} strokeWidth="2"/>
                <text x={x+21} y={by+14} fontSize="18" fill={j===0?COR.azul:COR.ambar}>{j===0?"A":"B"}</text>
                <rect x={x+50} y={by} width={w-115} height="20" rx="3" fill="#26374a"/>
                <rect x={x+50} y={by} width={(w-115)*e.pontuacoes[j]/teto*sobe} height="20" rx="3" fill={j===0?COR.azul:COR.ambar}/>
                <text x={x+w-17} y={by+15} textAnchor="end" fontSize="17">{numero(e.pontuacoes[j])}</text>
              </g>;
            })}
            <text x={x+50} y={y+235} fontSize="12" fill={COR.fraco}>0</text>
            <text x={x+w-65} y={y+235} textAnchor="end" fontSize="12" fill={COR.fraco}>{numero(teto)}</text>
          </g>
          <g opacity={visivel(3)}><text x={x+16} y={y+264} fontSize="16" fill={COR.verde}>Maior valor → token {token(e)}</text></g>
          <g opacity={visivel(4)}>
            <rect x={x+14} y={y+280} width={w-28} height="27" rx="6" fill="#26374a"/>
            <text x={x+25} y={y+299} fontSize="14">Próxima entrada: pergunta + <tspan fill={vencedor===0?COR.azul:COR.ambar}>token {token(e)}</tspan></text>
            <path d={`M${x+w-18},${y+293} H${x+w-5} V${y+60} H${x+w-18}`} fill="none" stroke={COR.azul} strokeWidth="1.5" markerEnd="url(#tz-seta)"/>
          </g>
        </g>;
      })}
      {!compacto && <g opacity={visivel(5)}>
        <rect x="220" y="479" width="520" height="54" rx="12" fill="#16352c" stroke={COR.verde}/>
        <text x="480" y="512" textAnchor="middle" fill={COR.verde} fontSize="22" fontWeight="600">
          {muda(caso) ? "B ≠ A · a escolha mudou" : "B = B · a escolha ficou igual"}
        </text>
      </g>}
    </g>
  </svg>;
}

function Composicao(props: { caso: Caso; compacto: boolean; teto: number }) {
  return <AbsoluteFill><Diagrama {...props} quadro={useCurrentFrame()}/></AbsoluteFill>;
}

function ResumoEstatico({dados,teto}: {dados:DadosMapa;teto:number}) {
  return <div data-tz-estatico>
    <h3>Uma conta diferente precisa mudar a escolha?</h3>
    {dados.casos.map(c => <section className="tz-resumo-caso" key={c.id}>
      <h4>{c.nome} · B vale {numero(c.b)}</h4>
      <div className="tz-resumo-lados">{c.execucoes.map((e,i)=><div key={e.ordem}>
        <b>Execução {i+1}</b><p>Soma guardada: {numero(e.soma)}</p>
        {[0,1].map(j=><div className="tz-barra-estatica" key={j}><span>{j===0?"A":"B"}</span>
          <span className="tz-trilho"><span style={{width:`${100*e.pontuacoes[j]/teto}%`,background:j===0?COR.azul:COR.ambar}}/></span><b>{numero(e.pontuacoes[j])}</b></div>)}
        <p className="tz-vencedor">Escolhe {token(e)} → pergunta + token {token(e)}</p>
      </div>)}</div><p>{descricao(c,5)}</p>
    </section>)}
  </div>;
}

export default function MapaTemperatura({bruto,comando}: {bruto:string;comando:string}) {
  const dados = useMemo(()=>montarMapa(bruto),[bruto]);
  const direto = useDireto(), player = useRef<PlayerRef>(null), caixa = useRef<HTMLDivElement>(null);
  const [montado,setMontado] = useState(false), [reduzido,setReduzido] = useState(false);
  const [compacto,setCompacto] = useState(true), [indice,setIndice] = useState(0);
  const [quadro,setQuadro] = useState(0), [tocando,setTocando] = useState(false);
  const [resposta,setResposta] = useState<boolean|null>(null);
  const respondeu = useRef(false), ultimoQuadro = useRef(0);
  const caso = dados.casos[indice], cena = cenaDe(quadro);
  const teto = Math.max(...dados.casos.flatMap(c=>c.execucoes.flatMap(e=>e.pontuacoes)));
  const video = montado && !direto && !reduzido;
  useEffect(()=>{
    const media=matchMedia("(prefers-reduced-motion: reduce)");
    const atualizar=()=>setReduzido(media.matches);
    atualizar();setMontado(true);media.addEventListener("change",atualizar);
    const obs=new ResizeObserver(([e])=>setCompacto(e.contentRect.width<620));
    if(caixa.current)obs.observe(caixa.current);
    return()=>{media.removeEventListener("change",atualizar);obs.disconnect();};
  },[]);
  useEffect(()=>{
    const p=player.current;if(!p)return;
    const sync=()=>setTocando(p.isPlaying());
    const avancar=(e:{detail:{frame:number}})=>{
      const f=limitarQuadro(e.detail.frame,respondeu.current);
      if(!respondeu.current && e.detail.frame>=PERGUNTA){p.pause();if(e.detail.frame!==PERGUNTA)p.seekTo(PERGUNTA);}
      ultimoQuadro.current=f;setQuadro(f);
    };
    sync();p.addEventListener("play",sync);p.addEventListener("pause",sync);p.addEventListener("ended",sync);p.addEventListener("frameupdate",avancar);
    p.seekTo(ultimoQuadro.current);
    return()=>{p.removeEventListener("play",sync);p.removeEventListener("pause",sync);p.removeEventListener("ended",sync);p.removeEventListener("frameupdate",avancar);};
  },[video,compacto]);
  const ir=(f:number)=>{const alvo=limitarQuadro(f,respondeu.current);player.current?.pause();player.current?.seekTo(alvo);ultimoQuadro.current=alvo;setQuadro(alvo);};
  const recomecar=(i=indice)=>{setIndice(i);respondeu.current=false;setResposta(null);ir(0);};
  const responder=(valor:boolean)=>{setResposta(valor);respondeu.current=true;ir(POR_CENA*3+30);};
  const esperando=quadro>=PERGUNTA && resposta===null;
  return <div ref={caixa} className="tz-mapa" data-vivo={video||undefined} data-cena={cena} data-condicao={caso.id}>
    <ResumoEstatico dados={dados} teto={teto}/>
    {video && <div className="tz-interativo">
      <header className="tz-cabecalho"><span>mesma entrada · mesma regra de escolha</span><h3>Uma conta diferente precisa mudar a escolha?</h3></header>
      <div className="tz-cenarios" role="group" aria-label="Condição do exemplo">
        {dados.casos.map((c,i)=><button key={c.id} type="button" aria-pressed={i===indice} onClick={()=>recomecar(i)}>{c.nome}<small>B = {numero(c.b)}</small></button>)}
      </div>
      <div className="tz-legenda-grafico"><span><i style={{background:COR.azul}}/>token A</span><span><i style={{background:COR.ambar}}/>token B</span><span>Mesma escala: 0 a {numero(teto)}</span></div>
      <Player ref={player} component={Composicao} inputProps={{caso,compacto,teto}}
        durationInFrames={DURACAO} fps={FPS} compositionWidth={compacto?360:960} compositionHeight={compacto?810:570}
        controls={false} autoPlay={false} loop={false} style={{width:"100%"}} acknowledgeRemotionLicense/>
      <div className="tz-leitura" aria-live="polite"><b>{cena+1} de {CENAS.length} · {CENAS[cena]}</b><p>{descricao(caso,cena)}</p></div>
      {esperando && <div className="tz-previsao" role="group" aria-label="Sua previsão">
        <b>Compare as barras. As duas execuções vão escolher o mesmo token?</b>
        <div><button type="button" onClick={()=>responder(false)}>O mesmo token</button><button type="button" onClick={()=>responder(true)}>Tokens diferentes</button></div>
      </div>}
      {resposta!==null && <p className="tz-feedback" role="status"><b>{resposta===muda(caso)?"Sua previsão confere.":"Veja o que os valores mostram."}</b> {descricao(caso,5)}</p>}
      <div className="tz-controles" role="group" aria-label="Controles da animação">
        <button type="button" onClick={()=>ir((cena-1)*POR_CENA+60)} disabled={quadro===0}>← Anterior</button>
        <button type="button" disabled={esperando||quadro===DURACAO-1} onClick={()=>player.current?.isPlaying()?player.current.pause():player.current?.play()}>{tocando?"Pausar":"Reproduzir"}</button>
        <button type="button" disabled={esperando||quadro===DURACAO-1} onClick={()=>ir((cena+1)*POR_CENA+60)}>Próxima →</button>
        <button type="button" onClick={()=>recomecar()}>Recomeçar</button>
      </div>
      <p className="tz-formula">Neste exemplo, A = soma guardada − 1024; B fica fixo. Mude a condição para conferir quando o vencedor permanece.</p>
    </div>}
    <p className="tz-origem">Ilustração numérica, não logits de um LLM. Valores calculados por <code>{comando}</code>, a partir de <code>numeros.py</code>. Sem áudio.</p>
  </div>;
}
