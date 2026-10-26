"""A nota de partida: um "agente" que passa toda pergunta para uma pessoa da equipe.

Ele nunca erra feio (não inventa prazo, não mostra pedido alheio), mas também não ajuda ninguém.
Todo agente que vier depois tem que bater esta nota.
"""
import sys
from collections import Counter
from pathlib import Path

from contrato import Caso, Decisao, carregar_referencia


def sempre_passar(pergunta: str) -> Decisao:
    return Decisao.PASSAR


def avaliar(decidir, casos: list[Caso]) -> dict[Decisao, tuple[int, int]]:
    """Para cada decisão esperada: quantos casos o decisor acertou, de quantos."""
    total, certos = Counter(), Counter()
    for c in casos:
        total[c.decisao] += 1
        certos[c.decisao] += decidir(c.pergunta) == c.decisao
    return {d: (certos[d], total[d]) for d in Decisao}


if __name__ == "__main__":
    casos = carregar_referencia()
    for caminho in sys.argv[1:]:
        casos += carregar_referencia(Path(caminho))
    placar = avaliar(sempre_passar, casos)
    for d, (certos, total) in placar.items():
        print(f"{d:<14} {certos:>2} de {total:>2}")
    acertos = sum(c for c, _ in placar.values())
    print(f"nota de partida: {acertos} de {len(casos)} ({acertos / len(casos):.0%})")
