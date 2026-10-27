"""O medidor: pede uma resposta ao modelo no Ollama e mede os dois trabalhos dele.

A pausa é o tempo até o primeiro pedaço com texto: o modelo lendo tudo o que recebeu.
O fluxo é quantos tokens ele escreve por segundo depois disso.
"""
import json
import time
import urllib.request
from pathlib import Path

OLLAMA = "http://localhost:11434/api/generate"
MODELO = "llama3.2:3b"
PASTA = Path(__file__).parent


def montar(caso, consulta):
    """O que o modelo lê: o número da consulta, o material e a pergunta no fim.

    O número vem primeiro porque o Ollama guarda as leituras anteriores: um começo diferente obriga a ler do zero.
    """
    material = [(PASTA / "dados" / nome).read_text(encoding="utf-8") for nome in caso["material"]]
    return "\n\n".join([f"Consulta {consulta}."] + material + [f"Pergunta: {caso['pergunta']}"])


def ler(pedacos, inicio, relogio=time.perf_counter):
    """Lê a resposta pedaço por pedaço; o último traz as contas do Ollama."""
    pausa = None
    for linha in pedacos:
        pedaco = json.loads(linha)
        if pausa is None and pedaco.get("response"):
            pausa = relogio() - inicio
        if pedaco.get("done"):
            return {
                "pausa": pausa,
                "fluxo": pedaco["eval_count"] / (pedaco["eval_duration"] / 1e9),
                "lidos": pedaco["prompt_eval_count"],
                "do_cache": pedaco.get("prompt_eval_cached_count", 0),
                "escritos": pedaco["eval_count"],
            }
    raise RuntimeError("a resposta acabou antes do último pedaço")


def perguntar(texto):
    """Manda o texto e recebe a resposta aos pedaços (stream), um por linha."""
    # num_gpu 0: nenhuma parte do modelo na placa de vídeo, para todo leitor medir no processador, como o livro
    pedido = {"model": MODELO, "prompt": texto, "stream": True, "options": {"temperature": 0, "num_predict": 64, "num_gpu": 0}}
    requisicao = urllib.request.Request(OLLAMA, data=json.dumps(pedido).encode(), headers={"Content-Type": "application/json"})
    inicio = time.perf_counter()
    with urllib.request.urlopen(requisicao) as resposta:
        return ler(resposta, inicio)
