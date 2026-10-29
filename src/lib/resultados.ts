/** As saídas gravadas de um experimento (saidas.json), como o `npm run experimentos` grava. */
export type Saidas = Record<string, { comando: string; saida: [string, string][] }>;

/** O resultado do molde: cada linha aponta uma saída gravada, e o número sai dela, como no placar dos livros. Na página e
 *  no Markdown do experimento. */
export function resultadosDo(id: string, resultado: { rotulo: string; saida: string }[], saidas: Saidas) {
  return resultado.map((r) => {
    const s = saidas[r.saida];
    if (!s) throw new Error(`experimentos/${id}: o resultado "${r.rotulo}" aponta a saída "${r.saida}", que não está no saidas.json; rode npm run experimentos`);
    const achado = s.saida.map(([l]) => l).find((l) => /\d+ de \d+ \(\d+%\)/.test(l))?.match(/(\d+) de (\d+) \((\d+)%\)/);
    if (!achado) throw new Error(`experimentos/${id}: a saída "${r.saida}" não tem "X de Y (Z%)"`);
    return { rotulo: r.rotulo, acertos: +achado[1], total: +achado[2], nota: `${achado[3]}%`, comando: s.comando };
  });
}
