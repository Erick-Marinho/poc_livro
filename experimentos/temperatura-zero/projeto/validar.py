"""Não deixe um denominador incompleto ou entradas distintas virarem placar."""


def validar(coleta):
    cfg = coleta["configuracao"]
    casos = coleta["casos"]
    if not casos or len({c["id"] for c in casos}) != len(casos):
        raise ValueError("casos ausentes ou repetidos")
    if coleta["ambiente"]["modo"] != "greedy_search":
        raise ValueError("a coleta não usou seleção gulosa")
    if coleta["ambiente"]["amostragem"] is not False:
        raise ValueError("a coleta usou amostragem")
    for caso in casos:
        lotes = caso["lotes"]
        if [l["tamanho"] for l in lotes] != cfg["lotes"] or cfg["lotes"][0] != 1:
            raise ValueError("a matriz de lotes está incompleta")
        if caso["referencia"] != lotes[0]["sequencias"][0]:
            raise ValueError("a referência não é a primeira execução no lote 1")
        for lote in lotes:
            if lote["entrada"] != lotes[0]["entrada"]:
                raise ValueError("a entrada alvo mudou entre lotes")
            if len(lote["sequencias"]) != cfg["repeticoes"]:
                raise ValueError("faltam repetições na coleta")
            for ids in lote["sequencias"]:
                if not ids or len(ids) > cfg["max_new_tokens"]:
                    raise ValueError("comprimento de saída inválido")
                if any(type(t) is not int or t < 0 for t in ids):
                    raise ValueError("IDs de token inválidos")
