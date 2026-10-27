"""Anota onde a coleta foi executada: a data, as versões, o modelo e a máquina. Sem isso, um número de tempo não diz nada."""
import json
import os
import platform
import urllib.request
from datetime import datetime, timezone

from medidor import MODELO


def ler_api(caminho):
    with urllib.request.urlopen(f"http://localhost:11434{caminho}") as resposta:
        return json.load(resposta)


def processador():
    try:
        linhas = open("/proc/cpuinfo", encoding="utf-8").read().splitlines()
        return next(l.split(":", 1)[1].strip() for l in linhas if l.startswith("model name"))
    except (OSError, StopIteration):
        return platform.processor()


def ambiente():
    modelo = next(m for m in ler_api("/api/tags")["models"] if m["name"] == MODELO)
    return {
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
