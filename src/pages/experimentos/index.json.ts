import { experimentos } from "../../lib/vitrine";

/** /experimentos/index.json: os experimentos para a landing do FontMar.ai, o mais novo em cima, os mesmos da página /experimentos/. */
export async function GET() {
  return Response.json({ experimentos: await experimentos() });
}
