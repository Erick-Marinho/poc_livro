/**
 * A home do FontMar.ai, para onde a marca e o "Início" levam. Vem de PUBLIC_URL_INICIO (o `npm run dev` aponta para o
 * FontMar.ai local, em http://localhost:5173/); sem ela, "/", para quando os dois sites estiverem no mesmo domínio.
 */
export const INICIO: string = import.meta.env.PUBLIC_URL_INICIO || "/";
