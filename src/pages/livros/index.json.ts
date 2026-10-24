import { estante } from "../../lib/vitrine";

/** /livros/index.json: a estante para a landing do FontMar.ai, a mesma da página /livros/. */
export async function GET() {
  return Response.json({ livros: await estante() });
}
