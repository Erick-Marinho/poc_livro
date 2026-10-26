# Para o Erick — novo experimento sobre temperatura zero

Etapa 1: fontes, hipótese, régua e percurso proposto. (redação: gpt-6.1-sol)

## O que esta entrega estabelece

O [plano](../capacidades/experimento-temperatura-zero.md) prepara um experimento no padrão do projeto: afirmação
com fonte, régua antes da construção, mecanismo à vista, IDE guiada, resultado medido e custo. O leitor constrói um
medidor e aprende a interpretar sua evidência. A página e as inferências com LLM ainda não foram implementadas.

Erick informou uma NVIDIA RTX 4060 em outra máquina e perguntou pela escolha de CPU/GPU. A proposta usa CPU como
caminho acessível, inclusive com um modelo pequeno real, e GPU como extensão para comparar lotes e o modo
invariante. A proposta não atribui esse desenho final ao Erick antes da revisão. VRAM, sistema, driver e forma de
executar nessa outra máquina ainda precisam ser conferidos. Nenhum acesso remoto ou gasto foi realizado.

## Auditoria do texto fornecido

| Afirmação do anexo | Tratamento no experimento | Fonte |
|---|---|---|
| Temperatura zero elimina o sorteio do próximo token | Explicar seleção gulosa e seus parâmetros efetivos; não calcular uma divisão por zero | [Estratégias de geração, Transformers](https://huggingface.co/docs/transformers/main/en/generation_strategies) |
| A soma em fp16 muda com os parênteses | Manter como prova numérica; converter também resultados intermediários, exibindo que 0,4 já foi arredondado ao ser representado | [Formato binary16 em `struct`](https://docs.python.org/3/library/struct.html#format-characters) e sondagem abaixo |
| O mesmo kernel sempre devolve os mesmos bits | Qualificar por operação, backend e ambiente; não universalizar para todo kernel | [Reprodutibilidade, PyTorch](https://docs.pytorch.org/docs/2.14/notes/randomness.html) |
| Outras requisições são a causa de toda divergência | Tratar lote como mecanismo investigável; uma API opaca não permite isolar essa causa apenas observando respostas | [Cálculos em lote e isolados, PyTorch](https://docs.pytorch.org/docs/2.14/notes/numerical_accuracy.html#batched-computations-or-slice-computations) |
| A variação das pontuações necessariamente muda a escolha | Testar também uma margem que preserva a escolha; as pontuações do exemplo são construídas | Comparação numérica executada abaixo e teste de margem previsto no plano |
| Kernels invariantes resolvem o problema | Comparar no ambiente suportado e fixado; estabilidade não é garantia entre versões e placas | [Reprodutibilidade do vLLM](https://docs.vllm.ai/en/latest/usage/reproducibility/) e [invariância ao lote](https://docs.vllm.ai/en/latest/features/batch_invariance/) |
| Há um custo fixo de desempenho | Medir o nosso custo; a documentação explica o recurso, mas não determina o custo nesta máquina | [Inferência determinística, SGLang](https://docs.sglang.io/docs/advanced_features/deterministic_inference) |
| Se o usuário só conversa, isso não importa | Não adotar como conclusão geral; medir repetição e distinguir sua utilidade da qualidade da resposta | Distinção metodológica deste plano |

O experimento da Thinking Machines publicou 80 continuações distintas em mil execuções e igualdade nas mil com
sua implementação invariante. Os tempos de 26, 55 e 42 segundos são de outro ensaio de desempenho, com modelo menor.
Esses números têm contexto próprio e não serão apresentados como resultados nossos.
[Fonte primária](https://thinkingmachines.ai/blog/defeating-nondeterminism-in-llm-inference/).

No caminho CPU, a configuração de geração e o tempo precisam ser validados. O candidato
[`Qwen/Qwen3-0.6B`](https://huggingface.co/Qwen/Qwen3-0.6B) tem exemplos oficiais para Transformers e vLLM; isso não
substitui um teste no hardware do leitor. Não foi baixado nem executado nesta etapa.

## Sondagem numérica executada

Comando executado: `python3 /tmp/temperatura-zero-sondagem.py`. Código completo abaixo para reproduzir em outra
máquina; só usa a biblioteca padrão. `struct` armazena em binary16 e volta a Python a cada operação indicada.
Isto modela esse arredondamento explicitamente, sem simular o desempenho nem a acumulação de um kernel real.

```python
import json
import struct


def fp16(valor):
    return struct.unpack("e", struct.pack("e", valor))[0]


a, b, c = map(fp16, (1024, 0.4, 0.4))
esquerda = fp16(fp16(a + b) + c)
direita = fp16(a + fp16(b + c))
alternativa_b = fp16(0.5)
resultados = []
for nome, soma in (("esquerda", esquerda), ("direita", direita)):
    pontuacao_a = fp16(soma - a)
    resultados.append({
        "ordem": nome, "soma": soma,
        "pontuacoes_construidas": [pontuacao_a, alternativa_b],
        "escolha": "A" if pontuacao_a > alternativa_b else "B",
    })

print(json.dumps({
    "tipo": "sondagem numérica; pontuações construídas, não logits de LLM",
    "entradas_representadas": [a, b, c],
    "resultados": resultados,
    "controle_ordem_fixa": len({fp16(fp16(a + b) + c) for _ in range(1000)}),
    "controle_inteiros": [fp16(fp16(a + 1) + 1), fp16(a + fp16(1 + 1))],
}, ensure_ascii=False, indent=2))
```

Saída real:

```json
{
  "tipo": "sondagem numérica; pontuações construídas, não logits de LLM",
  "entradas_representadas": [
    1024.0,
    0.39990234375,
    0.39990234375
  ],
  "resultados": [
    {
      "ordem": "esquerda",
      "soma": 1024.0,
      "pontuacoes_construidas": [
        0.0,
        0.5
      ],
      "escolha": "B"
    },
    {
      "ordem": "direita",
      "soma": 1025.0,
      "pontuacoes_construidas": [
        1.0,
        0.5
      ],
      "escolha": "A"
    }
  ],
  "controle_ordem_fixa": 1,
  "controle_inteiros": [
    1026.0,
    1026.0
  ]
}
```

O resultado mostra sensibilidade à ordem e uma escolha diferente para pontuações construídas, sem empate. A ordem
fixa foi estável em mil repetições; os inteiros escolhidos não divergiram. Portanto, mudar a ordem pode importar,
mas somas em ponto flutuante não passam a sortear resultados espontaneamente. A escolha de valores neste exemplo
é deliberada e visível; não é uma divergência observada num LLM.

## Recursos de ensino preparados no plano

- Um mapa situa a escolha do token dentro do cálculo inteiro antes da construção.
- Duas árvores mostram cada arredondamento, depois da previsão do leitor.
- Um controle de margem permite testar quando a escolha muda e quando permanece.
- O comparador usa tokens de inferências reais; também deve mostrar um resultado todo igual.
- A IDE constrói o medidor desde a pasta vazia, com um erro investigável, controles, modificações e perguntas
  sobre o que a saída prova. Há modo direto e alternativa CPU para a execução na máquina do leitor.

Cada peça tem ação, fonte e versão direta no plano. Uma animação de mecanismo não será rotulada como telemetria
da GPU. As respostas reais serão capturadas e repetidas no site, sem chamar o modelo a cada visita.

## Verificação desta entrega

- Leitura do anexo, `AGENTS.md`, princípios, ritmo, formato, molde dos experimentos, experimento existente e decisões
  de conversa/imersão/passo a passo.
- Sondagem CPU acima executada, incluindo controles; nenhuma inferência real alegada.
- O bloco Python deste relatório foi extraído e executado novamente; seu JSON foi comparado com a saída registrada
  e deu igualdade completa. Links locais dos dois documentos conferidos; `git diff --check` sem erros.
- Somente dois documentos novos no escopo desta entrega; nenhuma alteração de componentes compartilhados.
- A suíte do site não foi executada: não houve mudança no produto nem nas saídas. A implementação terá os testes
  do comparador, do roteiro, das figuras, `npm test`, ritmo e verificação de página nos três modos.

Esta etapa aguarda revisão do Erick. A próxima detalha a implementação a partir da escolha CPU/GPU e da
configuração confirmada da máquina com GPU.

(redação: gpt-6.1-sol)
