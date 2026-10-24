"""A régua: as perguntas de referência (perguntas.jsonl), cada uma com os fatos que a resposta certa tem que trazer, e
que a nota citada como fonte também tem que trazer: acertar a resposta com a fonte errada não conta.

    uv run python medir.py              # o cérebro com a data
    uv run python medir.py --sem-data   # a busca ingênua
    uv run python medir.py --modelo     # o modelo local escreve a resposta (modelo.py)
"""
import json
import sys
import unicodedata
from pathlib import Path

from cerebro import ler_cofre, responder


def sem_acento(texto: str) -> str:
    return unicodedata.normalize("NFKD", texto.lower()).encode("ascii", "ignore").decode()


def fonte(r) -> str:
    """O texto da nota de onde a resposta diz que veio (nenhum, se a nota citada não existe)."""
    return " ".join(r.nota.frases) if r.nota else ""


com_data = "--sem-data" not in sys.argv
if "--modelo" in sys.argv:
    from modelo import responder as do_modelo
    responder = lambda pergunta, _com_data, notas: do_modelo(pergunta, notas)  # noqa: E731
casos = [json.loads(l) for l in (Path(__file__).parent / "perguntas.jsonl").read_text(encoding="utf-8").splitlines()]
notas = ler_cofre()
acertos = 0
for c in casos:
    r = responder(c["pergunta"], com_data, notas)
    certo = all(sem_acento(f) in sem_acento(r.frase) and sem_acento(f) in sem_acento(fonte(r)) for f in c["certa"])
    acertos += certo
    print(f"{'✓' if certo else '✗'} {c['pergunta']}  ->  {r.frase}")
print(f"nota: {acertos} de {len(casos)} ({acertos / len(casos):.0%})")
