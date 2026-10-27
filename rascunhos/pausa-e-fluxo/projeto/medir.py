"""O resultado: lê a coleta gravada e imprime o placar e o meio de cada caso.

    uv run python medir.py
"""
import json
from statistics import median

from medidor import PASTA
from placar import placar

coleta = json.loads((PASTA / "coleta.json").read_text(encoding="utf-8"))
rodadas = coleta["rodadas"]
a = coleta["ambiente"]
print(f"{a['modelo']} no Ollama {a['ollama']}, {a['onde']}: {a['processador']}, {a['memoria_gb']} GB")
for caso in ["curta", "media", "longa", "de_novo"]:
    m = [r[caso] for r in rodadas]
    print(f"{caso:8} lê {m[0]['lidos']:5} tokens   pausa {median(x['pausa'] for x in m):5.2f} s   "
          f"fluxo {median(x['fluxo'] for x in m):5.1f} tokens/s   do cache {median(x['do_cache'] for x in m):6.0f}")
for linha in placar(rodadas):
    print(linha)
