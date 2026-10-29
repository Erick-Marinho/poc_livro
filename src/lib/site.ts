/**
 * A home do FontMar.ai, para onde a marca e o "Início" levam. Vem de PUBLIC_URL_INICIO; sem ela, "/": os dois sites no
 * mesmo domínio, como no `npm run dev` (a landing junto, scripts/dev.sh), no túnel e em produção.
 */
export const INICIO: string = import.meta.env.PUBLIC_URL_INICIO || "/";

/** O endereço público do site, para os links absolutos de um arquivo baixado (o Markdown de um experimento). */
export const ENDERECO = "https://fontemar-ai.web.app";
