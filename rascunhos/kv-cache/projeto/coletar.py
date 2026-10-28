"""Gera as duas mensagens com e sem cache, no modelo real, e grava a coleta. Não é executado pelo build nem pelo roteiro.

    uv run --extra modelo python coletar.py coleta.json [repetições] [novos]
"""
import json
import platform
import sys
import time
from datetime import datetime, timezone
from pathlib import Path

from laco import gerar

PASTA = Path(__file__).parent


def mensagem(caso):
    """O que o modelo lê: o material do regulamento, nesta ordem, e a pergunta no fim."""
    material = [(PASTA / "dados" / nome).read_text(encoding="utf-8") for nome in caso["material"]]
    return "\n\n".join(material + [f"Pergunta: {caso['pergunta']}"])


def coletar(destino, repeticoes=None, novos=None):
    import torch
    import transformers
    from transformers import AutoModelForCausalLM, AutoTokenizer

    from modelo import Leitor

    cfg = json.loads((PASTA / "configuracao.json").read_text())
    repeticoes, novos = int(repeticoes or cfg["repeticoes"]), int(novos or cfg["novos"])
    torch.set_num_threads(cfg["threads"])
    tokenizador = AutoTokenizer.from_pretrained(cfg["modelo"], revision=cfg["revisao"])
    inicio = time.perf_counter()
    modelo = AutoModelForCausalLM.from_pretrained(cfg["modelo"], revision=cfg["revisao"], torch_dtype=torch.float32).eval()
    carregamento = time.perf_counter() - inicio
    fim = tokenizador.convert_tokens_to_ids("<|im_end|>")
    leitores = {"com": Leitor(modelo, com_cache=True), "sem": Leitor(modelo, com_cache=False)}

    def entrada(texto):
        return tokenizador.apply_chat_template([{"role": "user", "content": texto}], tokenize=True,
            add_generation_prompt=True, enable_thinking=False)

    casos = [json.loads(l) for l in (PASTA / "casos.jsonl").read_text().splitlines()]
    entradas = {c["id"]: entrada(mensagem(c)) for c in casos}
    gerar(leitores["com"], entrada("Diga olá."), com_cache=True, novos=8)  # aquecimento, descartado
    inicio = time.perf_counter()
    config = modelo.config

    def gravar(registros):
        """Grava o que já foi coletado: se a coleta parar no meio, as repetições completas ficam."""
        ambiente = {"hardware": platform.processor() or platform.machine(), "sistema": platform.platform(),
            "python": platform.python_version(), "torch": torch.__version__, "transformers": transformers.__version__,
            "precisao": "float32", "atencao": config._attn_implementation, "threads": torch.get_num_threads(),
            "camadas": config.num_hidden_layers, "cabecas_kv": config.num_key_value_heads, "dimensao": config.head_dim,
            "carregamento_segundos": carregamento, "coleta_segundos": time.perf_counter() - inicio,
            "quando": datetime.now(timezone.utc).isoformat(), "aquecimento": "Diga olá."}
        coleta = {"configuracao": {**cfg, "repeticoes": repeticoes, "novos": novos}, "ambiente": ambiente,
            "entradas": {k: len(v) for k, v in entradas.items()}, "fim": fim, "repeticoes": registros,
            "respostas": {c["id"]: tokenizador.decode(registros[0][c["id"]]["com"]["tokens"]) for c in casos}}
        Path(destino).write_text(json.dumps(coleta, ensure_ascii=False, indent=1) + "\n")

    registros = []
    for r in range(repeticoes):
        repeticao = {}
        for c in casos:
            repeticao[c["id"]] = {}
            for modo, leitor in leitores.items():
                repeticao[c["id"]][modo] = gerar(leitor, entradas[c["id"]], com_cache=modo == "com", novos=novos, fim=fim)
                print(f'repetição {r + 1}, {c["id"]} {modo} cache: {sum(repeticao[c["id"]][modo]["tempos"]):.1f} s', flush=True)
        registros.append(repeticao)
        gravar(registros)


if __name__ == "__main__":
    coletar(*sys.argv[1:])
