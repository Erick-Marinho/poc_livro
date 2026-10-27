"""A coleta: dez repetições no modelo de verdade, gravadas em coleta.json com a máquina e as versões.

    uv run python coletar.py

Cada repetição pede a curta, a média, a longa e a longa de novo, logo em seguida.
"""
import json
import urllib.request

from maquina import ambiente
from medidor import MODELO, PASTA, montar, perguntar

REPETICOES = 10
casos = {c["id"]: c for c in map(json.loads, (PASTA / "casos.jsonl").read_text(encoding="utf-8").splitlines())}

# o Ollama guarda as leituras anteriores: tira o modelo da memória, e cada pedido ganha o seu número de atendimento
urllib.request.urlopen(urllib.request.Request("http://localhost:11434/api/generate", data=json.dumps({"model": MODELO, "keep_alive": 0}).encode())).close()
perguntar("Oi.")  # o aquecimento não entra na conta
repeticoes = []
for n in range(REPETICOES):
    numeros = {"curta": 4 * n + 1, "media": 4 * n + 2, "longa": 4 * n + 3}
    vez = {cid: perguntar(montar(casos[cid], numero)) for cid, numero in numeros.items()}
    vez["de_novo"] = perguntar(montar(casos["longa"], numeros["longa"]))  # o mesmo texto da longa
    repeticoes.append(vez)
    print(f"vez {n + 1}: " + ", ".join(f"{k} {m['pausa']:.2f} s" for k, m in vez.items()))

(PASTA / "coleta.json").write_text(json.dumps({"ambiente": ambiente(), "repeticoes": repeticoes}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
