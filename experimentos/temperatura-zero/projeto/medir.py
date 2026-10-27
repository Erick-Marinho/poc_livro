"""Lê uma coleta; repetir este comando não faz novas inferências."""
import json
import sys
from pathlib import Path

from comparar import resumo
from validar import validar


def medir(arquivo):
    coleta = json.loads(Path(arquivo).read_text())
    validar(coleta)
    print("Leitura da coleta:", coleta["ambiente"]["dispositivo"])
    print("modelo:", coleta["configuracao"]["modelo"])
    print("revisão:", coleta["configuracao"]["revisao"])
    iguais = total = 0
    for caso in coleta["casos"]:
        for lote in caso["lotes"]:
            r = resumo(lote["sequencias"], caso["referencia"])
            iguais += r["iguais"]
            total += r["total"]
            print(f'{caso["id"]}, lote {lote["tamanho"]}: {r["iguais"]}/{r["total"]} iguais; {r["unicas"]} sequência(s) única(s)')
    print(f"iguais à referência: {iguais} de {total} ({100 * iguais // total}%)")
    print("Repetição não mede se a resposta está certa.")


if __name__ == "__main__":
    medir(sys.argv[1])
