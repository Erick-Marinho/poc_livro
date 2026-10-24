import { guias } from "../../lib/vitrine";

/** /guias/index.json: os guias para a landing do FontMar.ai, o mais novo em cima, os mesmos da página /guias/. */
export async function GET() {
  return Response.json({ guias: await guias() });
}
