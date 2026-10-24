"""A régua: as perguntas de referência (perguntas.jsonl), cada uma com o pedaço que a resposta certa tem que trazer.

    uv run python medir.py              # o cérebro com a data
    uv run python medir.py --sem-data   # a busca ingênua
"""
import json
import sys
from pathlib import Path

from cerebro import ler_cofre, responder

com_data = "--sem-data" not in sys.argv
casos = [json.loads(l) for l in (Path(__file__).parent / "perguntas.jsonl").read_text(encoding="utf-8").splitlines()]
notas = ler_cofre()
acertos = 0
for c in casos:
    r = responder(c["pergunta"], com_data, notas)
    certo = c["certa"] in r.frase
    acertos += certo
    print(f"{'✓' if certo else '✗'} {c['pergunta']}  ->  {r.frase}")
print(f"nota: {acertos} de {len(casos)} ({acertos / len(casos):.0%})")
