/** As datas dos guias ("2026-10-24") como a página mostra: "24 OUT" na lista, "24 de outubro de 2026" no guia. */
const MESES = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

const partes = (data: string) => data.split("-").map(Number) as [number, number, number];

export const dataCurta = (data: string) => { const [, m, d] = partes(data); return `${d} ${MESES[m - 1].slice(0, 3).toUpperCase()}`; };
export const dataLonga = (data: string) => { const [a, m, d] = partes(data); return `${d} de ${MESES[m - 1]} de ${a}`; };
