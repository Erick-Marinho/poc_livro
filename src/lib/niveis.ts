/**
 * Os níveis dos experimentos (docs/capacidades/niveis-dos-experimentos.md): o nome, quantos degraus acendem na etiqueta
 * e o que cada um pede do leitor, em uma frase. O molde (content.config.ts) só aceita estes três.
 */
export const NIVEIS = {
  novato: { nome: "Novato", degrau: 1, pede: "abrir o terminal e seguir os passos; o conceito é explicado do zero" },
  intermediario: { nome: "Intermediário", degrau: 2, pede: "Python e terminal no básico, e já ter usado um modelo de linguagem; o experimento explica o resto" },
  avancado: { nome: "Avançado", degrau: 3, pede: "entender o que acontece dentro do modelo ou da máquina (contas, precisão, inferência), e Python com folga" },
} as const;
export type Nivel = keyof typeof NIVEIS;
export const IDS_DOS_NIVEIS = Object.keys(NIVEIS) as [Nivel, ...Nivel[]];
