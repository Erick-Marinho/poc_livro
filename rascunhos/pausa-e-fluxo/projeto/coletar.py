"""A coleta: dez rodadas no modelo de verdade, gravadas em coleta.json com a máquina e as versões.

    uv run python coletar.py

Cada rodada pede a curta, a média, a longa e a longa de novo, logo em seguida.
"""
import json
import urllib.request

from maquina import ambiente
from medidor import MODELO, PASTA, montar, perguntar

RODADAS = 10
casos = {c["id"]: c for c in map(json.loads, (PASTA / "casos.jsonl").read_text(encoding="utf-8").splitlines())}

# o Ollama guarda as leituras anteriores: tira o modelo da memória, e cada pedido ganha o seu número de atendimento
urllib.request.urlopen(urllib.request.Request("http://localhost:11434/api/generate", data=json.dumps({"model": MODELO, "keep_alive": 0}).encode())).close()
perguntar("Oi.")  # o aquecimento não entra na conta
rodadas = []
for n in range(RODADAS):
    numeros = {"curta": 4 * n + 1, "media": 4 * n + 2, "longa": 4 * n + 3}
    rodada = {cid: perguntar(montar(casos[cid], numero)) for cid, numero in numeros.items()}
    rodada["de_novo"] = perguntar(montar(casos["longa"], numeros["longa"]))  # o mesmo texto da longa
    rodadas.append(rodada)
    print(f"rodada {n + 1}: " + ", ".join(f"{k} {m['pausa']:.2f} s" for k, m in rodada.items()))

(PASTA / "coleta.json").write_text(json.dumps({"ambiente": ambiente(), "rodadas": rodadas}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
