"""O placar da régua: em quantas rodadas cada parte da afirmação se confirmou.

Cada rodada traz as medidas da curta, da longa e da longa pedida de novo logo em seguida.
"""
FOLGA = 0.20  # "quase não muda": o fluxo da longa fica a até 20% do da curta


def contar(acertos, total):
    return f"{acertos} de {total} ({acertos / total:.0%})"


def placar(rodadas):
    pausa = sum(r["longa"]["pausa"] > r["curta"]["pausa"] for r in rodadas)
    fluxo = sum(abs(r["longa"]["fluxo"] - r["curta"]["fluxo"]) <= FOLGA * r["curta"]["fluxo"] for r in rodadas)
    cache = sum(r["de_novo"]["pausa"] < r["longa"]["pausa"] and r["de_novo"]["do_cache"] > 0 for r in rodadas)
    return [
        f"a pausa da longa foi maior que a da curta: {contar(pausa, len(rodadas))}",
        f"o fluxo da longa ficou a até 20% do da curta: {contar(fluxo, len(rodadas))}",
        f"a longa pedida de novo começou mais rápido, lendo do cache: {contar(cache, len(rodadas))}",
    ]
