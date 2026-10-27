"""O exemplo numérico para a figura; não executa inferência de um modelo de linguagem.

Além das pontuações e das escolhas, guarda o caminho das duas somas (cada soma parcial, antes e depois de ir para
binary16) e os valores que o binary16 consegue guardar perto de 1024, para a figura desenhar a régua de 16 bits.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "projeto"))
from numeros import escolher, fp16, somas  # noqa: E402

grande, pequeno = fp16(1024), fp16(0.4)


def passo(x, y):
    return {"parcelas": [x, y], "exato": x + y, "guardado": fp16(x + y)}


esquerda = [passo(grande, pequeno)]
esquerda.append(passo(esquerda[0]["guardado"], pequeno))
direita = [passo(pequeno, pequeno)]
direita.append(passo(grande, direita[0]["guardado"]))
caminhos = [{"ordem": "esquerda", "passos": esquerda}, {"ordem": "direita", "passos": direita}]
assert [c["passos"][-1]["guardado"] for c in caminhos] == list(somas())

# o que o binary16 guarda entre 1023 e 1026: só inteiros, de um em um
guardaveis = sorted({fp16(1023 + k / 16) for k in range(49)})

casos = []
for id_, nome, margem in (("disputa", "Disputa apertada", 0.5), ("folga", "B com folga", 2.0)):
    execucoes = []
    for ordem, soma in zip(("esquerda", "direita"), somas()):
        pontuacoes = [soma - 1024, margem]
        execucoes.append({"ordem": ordem, "soma": soma, "pontuacoes": pontuacoes,
                          "escolha": escolher(pontuacoes)})
    casos.append({"id": id_, "nome": nome, "b": margem, "execucoes": execucoes})

print(json.dumps({"tipo": "ilustração numérica, não pontuações de um modelo de linguagem", "guardaveis": guardaveis,
                  "caminhos": caminhos, "casos": casos}, ensure_ascii=False))
