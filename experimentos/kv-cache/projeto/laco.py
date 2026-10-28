"""O laço de geração: escreve um token por vez, com ou sem o KV cache, e cronometra cada passo.

O modelo é qualquer objeto com ler(ids, cache), que devolve o próximo token e o cache atualizado.
Com cache, o modelo guarda o que já leu e só lê o token novo; sem cache, relê tudo a cada passo.
"""
import time

NOVOS = 128  # tokens escritos em cada geração, nos dois modos


def gerar(modelo, entrada, com_cache, novos=NOVOS, fim=None, relogio=time.perf_counter):
    """Gera sempre `novos` tokens, mesmo depois do fim da resposta, para os dois modos medirem os mesmos passos."""
    ids = list(entrada)
    para_ler = list(ids)
    cache = None
    registro = {"tokens": [], "tempos": [], "lidos": [], "cache_bytes": [], "fim": None}
    for passo in range(novos):
        inicio = relogio()
        token, cache = modelo.ler(para_ler, cache if com_cache else None)
        registro["tempos"].append(relogio() - inicio)
        registro["lidos"].append(len(para_ler))
        registro["cache_bytes"].append(modelo.bytes_do_cache(cache) if com_cache else 0)
        registro["tokens"].append(token)
        if token == fim and registro["fim"] is None:
            registro["fim"] = passo
        ids.append(token)
        # com cache, o que já foi lido está guardado: basta o token novo
        para_ler = [token] if com_cache else list(ids)
    return registro


def bytes_esperados(camadas, cabecas_kv, dimensao, bytes_por_numero, tokens):
    """Uma chave e um valor por token, em cada cabeça K/V de cada camada."""
    return 2 * camadas * cabecas_kv * dimensao * bytes_por_numero * tokens
