# Ritmo

**Problema.** O leitor larga o texto linear: no capítulo 1, as seções 1.2 a 1.4 passam quase 4 minutos sem o leitor
fazer nada. Faltava um jeito de saber onde, o quê e como tornar o texto dinâmico sem depender de feeling.
A regra está em `docs/RITMO.md`; este plano é o caminho até ela valer no build.

## Etapas

1. A regra (`docs/RITMO.md`), o relógio (`npm run ritmo`) e o teste, que avisa sem falhar.
2. A skill `revisar-ritmo`, proposta para o Erick salvar: o roteiro que aplica a regra num rascunho.
3a. O capítulo 1 abaixo de 400: as ações Aposta, Pilhas e Troca do protótipo, como componentes do livro.
3b. O experimento do segundo cérebro abaixo de 400.
3c. O limite de 400 passa a falhar no `npm test`.
4. A skill aplicada no capítulo 2, que ela não ajudou a escrever (o experimento já passou por ela na 3b).

## Decisões

- (0) Aviso acima de 200 palavras sem ação; falha acima de 400 (Erick, 25/10/2026).
- (0) Conta como ação o que pede uma decisão do leitor; abrir, assistir, rodar e rolar não contam (Erick, 25/10/2026).
- (0) A regra mora no repositório; a skill só tem o roteiro e lê a regra daqui, sem repetir números.
- (1) Todo componente está classificado no relógio; componente novo sem classificação faz o relógio parar.
- (1) O experimento do segundo cérebro também passa de 400: entra na etapa 3, antes de a falha valer no build.
- (3a) As mensagens das ações vêm do `referencia.jsonl`; o que o agente apressado fez e as frases da troca de prompt são
  ilustração, e a página diz.
- (3b) Antes da figura 1 do experimento, nenhuma ação: espera o vídeo da figura em vídeo ganhar a aposta (Erick, 25/10/2026).
- (3b) Aposta e Pilhas aceitam itens escritos, além dos casos do `referencia.jsonl`.

## Etapa atual: nenhuma

Capacidade fechada em 25/10/2026. Texto novo passa pela skill `revisar-ritmo` antes das interações, e o `npm test`
barra trecho acima de 400.

## Registro

| Etapa | Commit | Evidência | Ok |
|---|---|---|---|
| 1 | `f4435ed` | o relógio dos textos de hoje (788 no capítulo 1, 412 no experimento); teste do que conta como ação | 25/10 |
| 2 | skill salva | a skill `revisar-ritmo` revisada e salva pelo Erick; lê o `RITMO.md`, não guarda número | 25/10 |
| 3a | `fc10873` | o capítulo 1 sem trecho acima de 400 (788 virou 39, 183, 189, 230); as três ações usadas na página | 25/10 |
| 3b | `2e5e1e7` | o experimento sem trecho acima de 400 (412 virou 67, 243, 102, 74, 66); aposta, pare e pense e pilhas no navegador; números da aposta conferidos contra a régua | 25/10 |
| 3c | `b24d961` | o `npm test` passa com os textos de hoje (maior trecho: 322); numa cópia com 401 na 2.2, falha e diz o trecho; com 400, passa com aviso | 25/10 |
| 4 | `c6f9a3f` | a proposta da skill aprovada (A a D); o capítulo 2 sem trecho acima de 200 (236 e 322 viraram 111, 67, 33, 65, 147); as pilhas saem do `grafo-02.json`, conferidas no teste; capturas em 1280 e 360 px | 25/10 |
