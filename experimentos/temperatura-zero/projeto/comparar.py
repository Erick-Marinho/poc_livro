"""Compara IDs completos, inclusive quando uma sequência termina primeiro."""
from itertools import zip_longest


def primeiro_desvio(referencia, tentativa):
    fim = object()
    for indice, (a, b) in enumerate(zip_longest(referencia, tentativa, fillvalue=fim)):
        if a != b:
            return indice
    return None


def resumo(sequencias, referencia):
    if not sequencias:
        raise ValueError("não há execuções para medir")
    desvios = [primeiro_desvio(referencia, s) for s in sequencias]
    return {
        "iguais": desvios.count(None), "total": len(sequencias),
        "unicas": len({tuple(s) for s in sequencias}), "desvios": desvios,
    }
