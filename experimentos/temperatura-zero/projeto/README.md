# Temperatura zero: um medidor de repetição

`uv run python numeros.py` executa a prova numérica. As pontuações são construídas, não logits de um LLM.

`uv run python medir.py coleta-cpu.json` reanalisa a captura real publicada junto deste projeto. Não carrega pesos
nem executa inferências novas. `uv run python -m unittest -q` confere o comparador, os controles e a integridade da
coleta, sem dependências opcionais.

## Uma coleta nova, na sua máquina

Escolha apenas um caminho. O modelo é público e o download é gratuito; não precisa de chave. A primeira execução
baixa cerca de 1,5 GB de pesos. O tempo e a memória dependem da sua máquina.

```bash
# CPU: PyTorch sem bibliotecas CUDA
uv run --extra modelo python coletar.py cpu minha-coleta.json

# GPU NVIDIA: PyTorch com CUDA; confira antes o driver no seu sistema
uv run --extra gpu python coletar.py cuda minha-coleta-gpu.json

# O mesmo medidor lê qualquer uma das duas
uv run python medir.py minha-coleta.json
```

Os extras são mutuamente exclusivos. Trocar de CPU para GPU muda também a precisão: a comparação válida é entre
lotes no mesmo ambiente, não uma atribuição de diferenças exclusivamente ao dispositivo. O arquivo publicado foi
coletado em CPU; não há resultado medido em GPU nesta versão.

O script usa Transformers, não o servidor vLLM: os tamanhos em `configuracao.json` são os batches de entrada
passados diretamente ao modelo. As perguntas de preenchimento são as mesmas em toda a coleta. Os IDs do alvo
depois de EOS são descartados por serem padding do lote; EOS continua na sequência comparada. Entrada e máscara
são tratadas separadamente para que padding da entrada também não vire mudança de pergunta.

O modo é guloso (`do_sample=False`, `num_beams=1`), sem herdar os padrões de amostragem do modelo. Uma proteção
interrompe a coleta se `torch.multinomial` for chamado. A temperatura não é uma divisão por zero neste código.
Há uma chamada de aquecimento antes do relógio da geração; download/carregamento ficam fora desse relógio.

Para a comparação adicional de vLLM comum/invariante, ainda é necessária uma coleta específica, com versão,
backend, GPU e parâmetros registrados. Não há um “conserto da GPU” medido ou prometido por este projeto.

O limite informado para a outra máquina dos autores é 6 GB de VRAM; ainda não foi validado nela. Se uma condição
falhar por memória, registre a falha e revise a matriz antes de iniciar uma nova coleta; não misture só as condições
que couberam num denominador de coleta completa.
