/**
 * O formulário do substituto, no 2.2 (docs/capacidades/capitulo-2-em-cenas.md, etapa 2): a saída estruturada. O que a
 * animação mostra vem do projeto real: o grafo (como no 2.1, por roteiro.ts), o molde Escolha do agente.py (os campos
 * decisao e motivo) e o que o modelo de verdade respondeu à mensagem, na gravação do capítulo (gravacoes/r02-medir):
 * a decisão, o motivo e a resposta escrita. Só o texto solto do começo, "acho melhor encaminhar", é ilustração, e a
 * figura diz que é. Puro de propósito: o teste do livro chama isto direto.
 */
import { caminhosDaGravacao } from "../../../lib/grafoAgente.ts";
import { curta, montarRoteiro, type Entrada as EntradaGrafo, type Roteiro } from "./roteiro.ts";

export type Entrada = Omit<EntradaGrafo, "mensagens"> & {
  /** o que o modelo respondeu, gravado (gravacoes/r02-medir.json) */
  gravacao: Record<string, unknown>;
  /** o agente.py do projeto: os campos da Escolha saem dele */
  agente: string;
  /** a mensagem que preenche o formulário */
  mensagem: string;
};

export const FPS = 30;
export const SEGUNDOS = 22;
export const DURACAO = SEGUNDOS * FPS;
/** os momentos, em segundos: o texto solto (0 a 6,2), o formulário (6,2 a 12,2), o caminho (12,2 a 15,2), quem faz o quê (15,2 ao fim) */
export const T = { entra: [0.4, 2], solto: [1.6, 6.2], formulario: 6.2, quinta: [9.4, 11.6], marca: 7.4, caminho: [12.4, 13.8], escreve: 14.2, quem: 15.2 };
/** a ilustração do texto solto: o que um modelo devolveria se lhe pedissem só "decida" */
export const SOLTO = "Acho melhor encaminhar para um atendente, porque é um dado pessoal.";
export const QUINTA = "encaminhar";

export function montarFormulario({ arestas, nos, referencia, gravacao, agente, mensagem }: Entrada) {
  const r: Roteiro = montarRoteiro({ arestas, nos, referencia, mensagens: [mensagem, mensagem] });
  /* os campos da Escolha, lidos do agente.py: a figura não inventa o molde */
  const molde = agente.match(/class Escolha\(BaseModel\):[\s\S]*?\n\n\n/)?.[0];
  if (!molde) throw new Error("formulário do 2.2: o agente.py não tem a classe Escolha");
  const campos = [...molde.matchAll(/^\s{4}(\w+): (\w+)/gm)].map((m) => ({ nome: m[1], tipo: m[2] }));
  if (campos.map((c) => c.nome).join(",") !== "decisao,motivo") throw new Error(`formulário do 2.2: a Escolha tem ${campos.map((c) => c.nome).join(", ")}, e a figura desenha decisao e motivo`);
  if (campos[0].tipo !== "Decisao") throw new Error("formulário do 2.2: a decisão da Escolha não é a Decisao do contrato");
  /* o que o modelo respondeu, da gravação */
  const c = caminhosDaGravacao(gravacao as Parameters<typeof caminhosDaGravacao>[0], referencia).find((x) => x.id === mensagem);
  if (!c) throw new Error(`formulário do 2.2: ${mensagem} não está na gravação`);
  if (!r.balcoes.some((b) => b.id === c.decidiu)) throw new Error(`formulário do 2.2: o modelo decidiu ${c.decidiu}, que o grafo não tem`);
  if (!c.escrita) throw new Error(`formulário do 2.2: o balcão ${c.decidiu} não escreveu nada na gravação; a cena mostra a escrita do modelo`);
  return { ...r, pergunta: c.pergunta, decidiu: c.decidiu, esperado: c.esperado, motivo: c.motivo, escrita: c.escrita };
}
export type Formulario = ReturnType<typeof montarFormulario>;

export type Alvo = "decidir" | "setas" | "formulario" | "balcao" | "balcoes";
export type Balao = { de: number; ate: number; alvo: Alvo; texto: string };

/** os balões, um por vez; são também o texto da figura para quem não a vê */
export function baloes(f: Formulario): Balao[] {
  const b = f.balcoes.find((x) => x.id === f.decidiu)!;
  return [
    { de: 0.8, ate: 3.4, alvo: "decidir", texto: "Peça ao modelo só “decida o que fazer” e ele devolve texto. Ótimo para o cliente ler, péssimo para o código seguir." },
    { de: 3.4, ate: 6.2, alvo: "setas", texto: "Qual dos quatro caminhos é “encaminhar”? Abrir chamado, se alguém resolve depois; passar a vez, se alguém assume agora. O código teria de adivinhar." },
    { de: 6.2, ate: 9.4, alvo: "formulario", texto: "Então o agente pede um formulário, e não uma redação: a Escolha, com uma das quatro decisões do contrato e o motivo numa frase. É a saída estruturada." },
    { de: 9.4, ate: 12.2, alvo: "formulario", texto: `E se o modelo marcar uma quinta caixa, “${QUINTA}”? O pydantic recusa na hora, antes de o grafo dar um passo.` },
    { de: 12.2, ate: 15.2, alvo: "balcao", texto: `Com a decisão numa caixa, o código segue o caminho sem adivinhar: ${b.rotulo}. ${b.modelo === "não" ? "Ali, uma frase fixa." : "Ali, o modelo volta a escrever: agora, sim, texto para o cliente."}` },
    { de: 15.2, ate: 18.6, alvo: "balcoes", texto: "O modelo faz o que só ele faz: lê e escolhe, e escreve para o cliente. Onde não há o que escrever, o código põe uma frase fixa." },
    { de: 18.6, ate: SEGUNDOS + 1, alvo: "balcoes", texto: "Passar a vez e abrir chamado saem mais baratos, e, na hora de entregar o caso a uma pessoa, o modelo não tem o que improvisar." },
  ];
}

export { curta };
