/**
 * O que as composições do Remotion dividem (docs/capacidades/laco-do-agente.md): a fonte, as cores com sentido fixo
 * (docs/RITMO.md: acento é o que acontece agora, verde é o que o contrato pede, âmbar é erro, cinza é o que já passou)
 * e as curvas. As cores são as variáveis do livro, com uma reserva para fora dele (o Studio do my-video).
 */
import { Easing, interpolate } from "remotion";

export const ui = 'var(--f-ui, "IBM Plex Sans", system-ui, sans-serif)';
export const mono = 'var(--f-mono, "JetBrains Mono", ui-monospace, monospace)';
export const cor = { texto: "var(--ink, #24201a)", fraco: "var(--ink-2, #6b6357)", acento: "var(--acento, #2a4fb5)", ok: "var(--ok, #1f7a4c)",
  aviso: "var(--aviso, #9a5b00)", papel: "var(--papel, #f6f2ea)", nota: "var(--nota, #fbf8f2)", linha: "var(--linha, #ddd4c4)" };

export const suave = Easing.bezier(0.45, 0, 0.2, 1);
/** Um valor que anda entre pontos-chave [tempo, valor], parado antes do primeiro e depois do último. */
export const kf = (t: number, pontos: [number, number][], easing = Easing.linear) =>
  interpolate(t, pontos.map((p) => p[0]), pontos.map((p) => p[1]), { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });
