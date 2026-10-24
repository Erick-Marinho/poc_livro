/**
 * "O que vamos construir": a pergunta do prazo atravessando o cérebro do guia, etapa por etapa, com os números do
 * rastro gravado (figuras/rastro.py, conferido contra o cerebro.py). Responde: o que acontece entre a pergunta e a
 * resposta? Em cima, o fluxo; embaixo, o que cada etapa fez com a pergunta.
 */
import { LayoutGroup, MotionConfig, motion } from "motion/react";
import { Controles, LinhaDoTempo } from "../palco/Palco";
import { usePasseio } from "./passeio";
import "./cerebro.css";

type Frase = { palavras: number; nota: string; data: string; frase: string };
type Rastro = { pergunta: string; palavras: string[]; topo: number;
  notas: { arquivo: string; titulo: string; data: string; pontos: number; achada: boolean }[];
  frases: Frase[]; sem_data: { frase: string; nota: string; data: string };
  com_data: { frase: string; nota: string; data: string; antes: { frase: string; nota: string; data: string } | null } };

const sem = (s: string) => s.normalize("NFKD").replace(/[̀-ͯ]/g, "").toLowerCase();
const diaNum = (d: string) => { const [dd, mm] = d.split("/").map(Number); return mm * 100 + dd; };
const titulo = (arquivo: string) => arquivo.split("/").pop()!.replace(/\.md$/, "").replace(/^\d{4}-\d{2}-\d{2} /, "");
/* a data dentro da frase, marcada */
const comData = (f: string) => f.split(/(\d{2}\/\d{2})/).map((p, i) => i % 2 ? <mark key={i}>{p}</mark> : p);

export default function CaminhoDaPergunta({ bruto, comando, regua }: { bruto: string; comando: string; regua: { sem: string; com: string } }) {
  const r: Rastro = JSON.parse(bruto);
  const nota = (l: string) => l.match(/(\d+) de (\d+)/)!.slice(1).map(Number);
  const [semA, total] = nota(regua.sem), [comA] = nota(regua.com);
  const empatadas = r.frases.filter((f) => f.palavras === r.topo);
  const ordemBusca = (f: Frase) => r.notas.findIndex((n) => n.arquivo === f.nota);
  const maior = Math.max(...r.notas.map((n) => n.pontos));

  const passos = [
    { no: 0, duracao: 3800, texto: "A pergunta vira palavras: sem acento, e sem as que não dizem nada sozinhas." },
    { no: 1, duracao: 5200, texto: `O BM25 dá nota a cada uma das ${r.notas.length} notas do cofre; as ${r.notas.filter((n) => n.achada).length} melhores seguem.` },
    { no: 2, duracao: 5200, texto: `Nas notas achadas, as frases com mais palavras da pergunta: ${empatadas.length} empatam.` },
    { no: 3, duracao: 5200, texto: `Sem a data, vale a frase da nota mais parecida: ${r.sem_data.frase.match(/\d{2}\/\d{2}/)?.[0]}, de uma nota de ${r.sem_data.data}.` },
    { no: 3, duracao: 5800, texto: `Com a data, entre as que empatam, vale a mais nova: ${r.com_data.frase.match(/\d{2}\/\d{2}/)?.[0]}, de ${r.com_data.data}, com a velha ao lado.` },
    { no: 4, duracao: 4800, texto: `A régua: sem a data, ${semA} de ${total}; com ela, ${comA} de ${total}.` },
  ];
  const p = usePasseio(passos.map((x) => x.duracao));
  const atual = passos[p.passo];
  const nos = [
    { nome: "a pergunta", valor: `${r.palavras.length} palavras` },
    { nome: "a busca", valor: `${r.notas.filter((n) => n.achada).length} de ${r.notas.length} notas` },
    { nome: "as frases", valor: `${empatadas.length} empatam` },
    { nome: "a regra da data", valor: p.passo >= 4 ? r.com_data.data : "?" },
    { nome: "a régua", valor: `${comA} de ${total}` },
  ];
  const ordenadas = [...empatadas].sort(p.passo >= 4 ? (a, b) => diaNum(b.data) - diaNum(a.data) : (a, b) => ordemBusca(a) - ordemBusca(b));

  return <MotionConfig reducedMotion="user">
    <div className="palco cdp">
      <div className="palco-barra"><span className="cdp-pergunta">“{r.pergunta}”</span><span className="palco-selo" title={comando}>o rastro gravado do cerebro.py</span></div>
      {/* o fluxo: cada etapa acende quando a pergunta chega nela */}
      <ol className="cdp-fluxo" aria-label="As etapas do cérebro">
        {nos.map((n, i) => <li key={n.nome} data-estado={i < atual.no ? "feito" : i === atual.no ? "agora" : "antes"}>
          <b>{n.nome}</b><span>{i <= atual.no ? n.valor : " "}</span>
          {i < nos.length - 1 && <i className="cdp-seta" aria-hidden="true"><em style={{ transform: `scaleX(${i < atual.no ? 1 : 0})` }} /></i>}
        </li>)}
      </ol>
      <div className="cdp-palco" aria-live="polite">
        {/* cada etapa entra no lugar da anterior (sem esperar a outra sair: a troca é imediata e não trava) */}
          <motion.div key={atual.no} className="cdp-cena" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: .25 }}>
            {atual.no === 0 && <div className="cdp-palavras">
              {r.pergunta.replace(/[?.,!]/g, "").split(/\s+/).map((w, i) => {
                const fica = r.palavras.includes(sem(w));
                return <motion.span key={i} className={fica ? "cdp-fica" : "cdp-sai"} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * .18 }}>{w}</motion.span>;
              })}
            </div>}
            {atual.no === 1 && <ul className="cdp-notas">
              {r.notas.map((n, i) => <li key={n.arquivo} data-achada={n.achada || undefined}>
                <span className="cdp-nome">{n.titulo}<small>{n.data}</small></span>
                <span className="cdp-barra"><motion.i initial={{ width: 0 }} animate={{ width: `${(n.pontos / maior) * 100}%` }} transition={{ delay: i * .08, duration: .5 }} /></span>
                <span className="cdp-pontos">{n.pontos.toFixed(2)}</span>
              </li>)}
            </ul>}
            {atual.no === 2 && <ul className="cdp-frases">
              {r.frases.slice(0, 7).map((f, i) => <motion.li key={i} data-empata={f.palavras === r.topo || undefined} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * .12 }}>
                <span className="cdp-k">{f.palavras}</span><span>{comData(f.frase)}<small>{titulo(f.nota)} · {f.data}</small></span>
              </motion.li>)}
            </ul>}
            {atual.no === 3 && <LayoutGroup><ul className="cdp-empate">
              {ordenadas.map((f, i) => {
                const escolhida = p.passo >= 4 ? f.frase === r.com_data.frase : f.frase === r.sem_data.frase;
                const velha = p.passo >= 4 && r.com_data.antes?.frase === f.frase;
                return <motion.li layout key={f.nota} transition={{ type: "spring", stiffness: 260, damping: 26 }}
                  data-escolhida={escolhida || undefined} data-certo={escolhida ? String(p.passo >= 4) : undefined}>
                  <span className="cdp-data">{f.data}</span><span>{comData(f.frase)}<small>{titulo(f.nota)}</small></span>
                  {escolhida && <b className="cdp-selo">{p.passo >= 4 ? "✓ vale esta" : "✗ a velha"}</b>}
                  {velha && <b className="cdp-selo cdp-antes">antes</b>}
                </motion.li>;
              })}
            </ul><p className="cdp-regra">{p.passo >= 4 ? "ordenadas pela data da nota, a mais nova em cima" : "na ordem da busca: a nota mais parecida em cima"}</p></LayoutGroup>}
            {atual.no === 4 && <div className="cdp-regua">
              {[{ rotulo: "sem a data", n: semA }, { rotulo: "com a data", n: comA }].map((x, i) => <div key={x.rotulo}>
                <span>{x.rotulo}</span>
                <span className="cdp-barra"><motion.i initial={{ width: 0 }} animate={{ width: `${(x.n / total) * 100}%` }} transition={{ delay: i * .4, duration: .7 }} /></span>
                <b>{x.n} de {total}</b>
              </div>)}
            </div>}
          </motion.div>
      </div>
      <div className="palco-rodape">
        <Controles tocando={p.tocando} fim={p.fim} passo={p.passo} total={passos.length} alternar={p.alternar} ir={p.ir} />
        <LinhaDoTempo passos={passos} passo={p.passo} fracao={p.fracao} ir={p.ir} />
      </div>
      {/* de onde vêm os números: o comando que gravou o rastro, rodado no projeto do guia */}
      <p className="cdp-fonte">os números vêm de <code>{comando}</code></p>
    </div>
  </MotionConfig>;
}
