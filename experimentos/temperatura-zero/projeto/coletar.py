"""Inferências novas e locais. Não é executado pelo build nem pelo roteiro."""
import json
import platform
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from unittest.mock import patch


def coletar(dispositivo, destino):
    import torch
    import transformers
    from transformers import AutoModelForCausalLM, AutoTokenizer, GenerationConfig

    if dispositivo not in ("cpu", "cuda"):
        raise ValueError("escolha cpu ou cuda")
    if dispositivo == "cuda" and not torch.cuda.is_available():
        raise RuntimeError("CUDA não está disponível; use cpu ou confira a instalação da GPU")
    aqui = Path(__file__).parent
    cfg = json.loads((aqui / "configuracao.json").read_text())
    torch.set_num_threads(cfg["threads"])
    tokenizador = AutoTokenizer.from_pretrained(cfg["modelo"], revision=cfg["revisao"], padding_side="left")
    tipo = torch.float32 if dispositivo == "cpu" else torch.float16
    inicio = time.perf_counter()
    modelo = AutoModelForCausalLM.from_pretrained(cfg["modelo"], revision=cfg["revisao"], torch_dtype=tipo, attn_implementation="eager")
    modelo.to(dispositivo).eval()
    carregamento = time.perf_counter() - inicio
    geracao = GenerationConfig(do_sample=False, num_beams=1, max_new_tokens=cfg["max_new_tokens"],
        temperature=1.0, top_k=0, top_p=1.0, bos_token_id=tokenizador.bos_token_id,
        eos_token_id=modelo.generation_config.eos_token_id, pad_token_id=tokenizador.pad_token_id)
    assert geracao.get_generation_mode().value == "greedy_search"

    def gerar(perguntas):
        mensagens = [[{"role": "user", "content": p}] for p in perguntas]
        entradas = tokenizador.apply_chat_template(mensagens, tokenize=True, add_generation_prompt=True,
            enable_thinking=False, padding=True, return_tensors="pt", return_dict=True).to(dispositivo)
        with torch.inference_mode(), patch("torch.multinomial", side_effect=RuntimeError("a coleta não pode sortear")):
            saida = modelo.generate(**entradas, generation_config=geracao, use_model_defaults=False, do_sample=False, num_beams=1)
        # Guarde EOS, mas não o padding posterior que só completa o lote.
        ids = saida[0, entradas.input_ids.shape[1]:].tolist()
        eos = geracao.eos_token_id
        eos = [eos] if isinstance(eos, int) else eos
        parada = next((i for i, token in enumerate(ids) if token in eos), None)
        if parada is not None:
            ids = ids[:parada + 1]
        entrada_alvo = entradas.input_ids[0][entradas.attention_mask[0].bool()].tolist()
        return ids, entrada_alvo

    gerar(["Diga olá."])
    inicio = time.perf_counter()
    casos = []
    for linha in (aqui / "casos.jsonl").read_text().splitlines():
        caso = json.loads(linha)
        lotes = []
        for tamanho in cfg["lotes"]:
            sequencias = []
            for repeticao in range(cfg["repeticoes"]):
                ids, entrada = gerar([caso["pergunta"]] + [cfg["preenchimento"]] * (tamanho - 1))
                sequencias.append(ids)
                print(f'{caso["id"]} lote={tamanho} repetição={repeticao + 1}', flush=True)
            lotes.append({"tamanho": tamanho, "entrada": entrada, "sequencias": sequencias})
        casos.append({**caso, "referencia": lotes[0]["sequencias"][0], "lotes": lotes,
            "texto_referencia": tokenizador.decode(lotes[0]["sequencias"][0], skip_special_tokens=True)})
    ambiente = {"dispositivo": dispositivo, "hardware": platform.processor(), "sistema": platform.platform(),
        "python": platform.python_version(), "torch": torch.__version__, "transformers": transformers.__version__,
        "precisao": str(tipo), "atencao": "eager", "threads": torch.get_num_threads(), "cuda": torch.version.cuda,
        "carregamento_segundos": carregamento, "geracao_segundos": time.perf_counter() - inicio,
        "quando": datetime.now(timezone.utc).isoformat(), "aquecimento": "Diga olá.",
        "amostragem": False, "modo": geracao.get_generation_mode().value, "beams": 1, "cache": True, "thinking": False}
    if dispositivo == "cuda":
        ambiente.update(hardware=torch.cuda.get_device_name(), memoria_pico_bytes=torch.cuda.max_memory_allocated())
    coleta = {"formato": 1, "configuracao": cfg, "ambiente": ambiente, "casos": casos}
    Path(destino).write_text(json.dumps(coleta, ensure_ascii=False, indent=2) + "\n")


if __name__ == "__main__":
    coletar(*sys.argv[1:])
