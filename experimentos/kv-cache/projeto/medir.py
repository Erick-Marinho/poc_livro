"""Lê uma coleta e mostra o placar; repetir este comando não faz novas inferências.

    uv run python medir.py coleta.json
"""
import json
import statistics
import sys
from pathlib import Path

from laco import bytes_esperados
from placar import escrita, media, placar


def medir(arquivo):
    coleta = json.loads(Path(arquivo).read_text())
    amb, reps = coleta["ambiente"], coleta["repeticoes"]
    print(f'{coleta["configuracao"]["modelo"]} em {amb["precisao"]}, {amb["threads"]} threads, atenção {amb["atencao"]}')
    print(f'torch {amb["torch"]}, transformers {amb["transformers"]}, {amb["hardware"]}')
    for caso, tokens in coleta["entradas"].items():
        print(f"\n{caso}: {tokens} tokens lidos antes de escrever")
        for modo in ("com", "sem"):
            pausa = statistics.median(r[caso][modo]["tempos"][0] for r in reps)
            passo = statistics.median(media(escrita(r[caso][modo])) for r in reps)
            print(f"  {modo} cache: pausa {pausa:.3f} s; cada passo de escrita {1000 * passo:.1f} ms")
        com = reps[0][caso]["com"]
        conta = bytes_esperados(amb["camadas"], amb["cabecas_kv"], amb["dimensao"], 4, tokens + len(com["tokens"]) - 1)
        print(f'  o cache no fim: {com["cache_bytes"][-1] / 2**20:.1f} MiB; a conta: {conta / 2**20:.1f} MiB'
              f'{" (iguais)" if conta == com["cache_bytes"][-1] else " (DIFERENTES)"}')
        print(f'  a resposta acabou no passo {com["fim"]} de {len(com["tokens"])}')
    print()
    for linha in placar(reps):
        print(linha)


if __name__ == "__main__":
    medir(sys.argv[1])
