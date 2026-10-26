"""A nota de partida: um "agente" que passa toda pergunta para uma pessoa da equipe.

Ele nunca erra feio (não inventa prazo, não mostra pedido alheio), mas também não ajuda ninguém.
Todo agente que vier depois tem que bater esta nota.
"""
from collections import Counter

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
    import argparse
    from pathlib import Path

    argumentos = argparse.ArgumentParser(description="A nota de partida contra os casos do contrato.")
    argumentos.add_argument("casos", nargs="?", type=Path, help="arquivo de casos para somar à referência oficial")
    opcoes = argumentos.parse_args()
    casos = carregar_referencia()
    if opcoes.casos:
        casos += carregar_referencia(opcoes.casos)
    placar = avaliar(sempre_passar, casos)
    for d, (certos, total) in placar.items():
        print(f"{d:<14} {certos:>2} de {total:>2}")
    acertos = sum(c for c, _ in placar.values())
    print(f"nota de partida: {acertos} de {len(casos)} ({acertos / len(casos):.0%})")
