"""O exemplo numérico para a figura; não executa inferência de LLM."""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "projeto"))
from numeros import escolher, somas  # noqa: E402

casos = []
for id_, nome, margem in (("disputa", "Disputa apertada", 0.5), ("folga", "B com folga", 2.0)):
    execucoes = []
    for ordem, soma in zip(("esquerda", "direita"), somas()):
        pontuacoes = [soma - 1024, margem]
        execucoes.append({"ordem": ordem, "soma": soma, "pontuacoes": pontuacoes,
                          "escolha": escolher(pontuacoes)})
    casos.append({"id": id_, "nome": nome, "b": margem, "execucoes": execucoes})

print(json.dumps({"tipo": "ilustração numérica, não logits de LLM", "casos": casos}, ensure_ascii=False))
