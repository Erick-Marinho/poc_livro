"""O placar da régua: em quantas repetições cada parte da afirmação se confirmou.

Cada repetição traz as medidas da curta, da longa e da longa pedida de novo logo em seguida.
"""
FOLGA = 0.20  # "quase não muda": o fluxo da longa fica a até 20% do da curta


def contar(acertos, total):
    return f"{acertos} de {total} ({acertos / total:.0%})"


def placar(repeticoes):
    pausa = sum(r["longa"]["pausa"] > r["curta"]["pausa"] for r in repeticoes)
    fluxo = sum(abs(r["longa"]["fluxo"] - r["curta"]["fluxo"]) <= FOLGA * r["curta"]["fluxo"] for r in repeticoes)
    # todo pedido traz uns tokens do cache (o começo fixo que o Ollama põe antes da pergunta): conta a maior parte
    cache = sum(r["de_novo"]["pausa"] < r["longa"]["pausa"] and r["de_novo"]["do_cache"] > r["de_novo"]["lidos"] / 2 for r in repeticoes)
    return [
        f"a pausa da longa foi maior que a da curta: {contar(pausa, len(repeticoes))}",
        f"o fluxo da longa ficou a até 20% do da curta: {contar(fluxo, len(repeticoes))}",
        f"a longa pedida de novo começou mais rápido, lendo do cache: {contar(cache, len(repeticoes))}",
    ]
