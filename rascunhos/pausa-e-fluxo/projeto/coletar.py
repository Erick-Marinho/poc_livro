"""A coleta: dez rodadas no modelo de verdade, gravadas em coleta.json com a máquina e as versões.

    uv run python coletar.py

Cada rodada pede curta → média → longa → a longa de novo. O Ollama guarda as leituras anteriores, então cada
pedido começa com o seu número de atendimento e é lido do zero; só a longa de novo repete o texto da longa, de
propósito: é ela que mostra o cache.
"""
import json
import os
import platform
import urllib.request
from datetime import datetime, timezone

from medidor import MODELO, PASTA, montar, perguntar

RODADAS = 10


def ler_api(caminho):
    with urllib.request.urlopen(f"http://localhost:11434{caminho}") as resposta:
        return json.load(resposta)


def processador():
    try:
        linhas = open("/proc/cpuinfo", encoding="utf-8").read().splitlines()
        return next(l.split(":", 1)[1].strip() for l in linhas if l.startswith("model name"))
    except (OSError, StopIteration):
        return platform.processor()


casos = {c["id"]: c for c in map(json.loads, (PASTA / "casos.jsonl").read_text(encoding="utf-8").splitlines())}
modelo = next(m for m in ler_api("/api/tags")["models"] if m["name"] == MODELO)
ambiente = {
    "quando": datetime.now(timezone.utc).isoformat(timespec="seconds"),
    "ollama": ler_api("/api/version")["version"],
    "modelo": MODELO,
    "digest": modelo["digest"],
    "onde": "CPU (num_gpu 0)",
    "processador": processador(),
    "nucleos": os.cpu_count(),
    "memoria_gb": round(os.sysconf("SC_PAGE_SIZE") * os.sysconf("SC_PHYS_PAGES") / 2**30),
    "sistema": platform.platform(),
}

# tira o modelo da memória, e com ele o cache de uma coleta anterior; depois o aquecimento carrega de novo
urllib.request.urlopen(urllib.request.Request("http://localhost:11434/api/generate", data=json.dumps({"model": MODELO, "keep_alive": 0}).encode())).close()
perguntar("Oi.")  # o aquecimento não entra na conta
rodadas = []
for n in range(RODADAS):
    numeros = {"curta": 4 * n + 1, "media": 4 * n + 2, "longa": 4 * n + 3}
    rodada = {cid: perguntar(montar(casos[cid], numero)) for cid, numero in numeros.items()}
    rodada["de_novo"] = perguntar(montar(casos["longa"], numeros["longa"]))  # o mesmo texto da longa
    rodadas.append(rodada)
    print(f"rodada {n + 1}: " + ", ".join(f"{k} {m['pausa']:.2f} s" for k, m in rodada.items()))

(PASTA / "coleta.json").write_text(json.dumps({"ambiente": ambiente, "rodadas": rodadas}, ensure_ascii=False, indent=1) + "\n", encoding="utf-8")
