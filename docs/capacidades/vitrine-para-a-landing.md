# A vitrine para a landing

**Problema.** A landing do FontMar.ai vai mostrar os guias e os livros, que moram em outro repositório. A pergunta era se isso pedia backend.

**Regra que não muda.** A landing mostra o que o site tem, e só isso: os JSON saem do mesmo código que monta as páginas.

## Decisões

- (24/10/2026, Erick) Deixar pronto para testar a landing com um domínio do ngrok.
- (1) Sem backend: o build publica `/livros/index.json` e `/guias/index.json` (`src/lib/vitrine.ts`, o mesmo que monta `/livros/` e `/guias/`).
- (1) Um domínio só: a landing repassa ao site dos livros tudo que não é dela (proxy do Vite, no FontMarAI); sem CORS, e um túnel só no ngrok.
- (1) O repasse lê o site montado (`npm run site`): o `astro dev` serve arquivos do Vite com os mesmos caminhos dos da landing.
- (1) Backend só quando entrarem login, venda dos livros ou progresso do leitor.
- (24/10/2026, Erick) Não teremos cursos: saem da landing e dos planos.

## Peças

| Peça | Função | Entrada | Saída | Cor |
|---|---|---|---|---|
| `src/lib/vitrine.ts` | a estante e a lista dos guias, montadas do conteúdo | coleções + `sumario.json` | listas | nova |
| `src/pages/livros/index.json.ts`, `src/pages/guias/index.json.ts` | os JSON da landing | vitrine | `/livros/index.json`, `/guias/index.json` | nova |
| `testes/vitrine.test.mjs` | os JSON mostram o mesmo que as páginas, e os links abrem | `dist/` | `npm test` | nova |
| `npm run site` | o site montado, servido para a landing | build | http://localhost:4321 | nova |
| proxy e seções da landing (FontMarAI) | repassa o que não é dela; mostra guias recentes e livros | os JSON | a landing | nova |

## Etapas

1. Os JSON, o repasse num domínio só, e a landing mostrando os guias e os livros.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|

(redação: claude-opus-5-5)
