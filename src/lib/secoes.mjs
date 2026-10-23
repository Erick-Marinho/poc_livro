/**
 * Títulos de seção numerados: "## 3.1 O modelo pede" vira
 * <h2 id="s3-1"><span class="num">3.1</span>O modelo pede</h2>.
 * O número fica no texto do capítulo, onde o autor escreve; o visual sai daqui.
 */
export function secoesNumeradas() {
  return (arvore) => {
    const visitar = (no) => {
      if (no.type === "element" && no.tagName === "h2") {
        const primeiro = no.children[0];
        const m = primeiro && primeiro.type === "text" && primeiro.value.match(/^(\d+\.\d+)\s+(.*)$/s);
        if (m) {
          no.properties = { ...no.properties, id: "s" + m[1].replace(".", "-") };
          no.children = [
            { type: "element", tagName: "span", properties: { className: ["num"] }, children: [{ type: "text", value: m[1] }] },
            { type: "text", value: m[2] },
            ...no.children.slice(1),
          ];
        }
      }
      (no.children || []).forEach(visitar);
    };
    visitar(arvore);
  };
}
