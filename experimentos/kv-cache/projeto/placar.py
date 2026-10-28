"""O placar da régua: em quantas repetições cada parte da afirmação se confirmou.

Cada repetição traz a curta e a longa, cada uma gerada com e sem cache. O passo 0 lê a mensagem (a pausa) e fica
fora dos três primeiros itens, que contam só os passos de escrita.
"""
RAMPA = 2.0   # sem cache, os 16 últimos passos da curta custam ao menos o dobro dos 16 primeiros
JANELA = 16
PRECO = 10.0  # na longa, o passo sem cache custa ao menos 10 vezes o passo com cache
FOLGA = 0.20  # com cache, o passo da longa fica a até 20% do da curta


def media(tempos):
    return sum(tempos) / len(tempos)


def escrita(registro):
    return registro["tempos"][1:]


def contar(acertos, total):
    return f"{acertos} de {total} ({acertos / total:.0%})"


def placar(repeticoes):
    rampa = sum(media(escrita(r["curta"]["sem"])[-JANELA:]) >= RAMPA * media(escrita(r["curta"]["sem"])[:JANELA]) for r in repeticoes)
    preco = sum(media(escrita(r["longa"]["sem"])) >= PRECO * media(escrita(r["longa"]["com"])) for r in repeticoes)
    plano = sum(media(escrita(r["longa"]["com"])) <= (1 + FOLGA) * media(escrita(r["curta"]["com"])) for r in repeticoes)
    iguais = sum(r[caso]["com"]["tokens"] == r[caso]["sem"]["tokens"] for r in repeticoes for caso in ("curta", "longa"))
    return [
        f"sem cache, a escrita da curta ficou ao menos 2 vezes mais cara no fim: {contar(rampa, len(repeticoes))}",
        f"na longa, o passo sem cache custou ao menos 10 vezes o com cache: {contar(preco, len(repeticoes))}",
        f"com cache, o passo da longa ficou a até 20% do da curta: {contar(plano, len(repeticoes))}",
        f"os mesmos tokens com e sem cache: {contar(iguais, 2 * len(repeticoes))}",
    ]
