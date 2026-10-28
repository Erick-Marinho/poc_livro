"""O modelo de verdade, no PyTorch: o ler(ids, cache) que o laço chama a cada passo.

Precisa do extra `modelo` (uv run --extra modelo ...); os testes não o importam.
"""
import torch
from transformers import DynamicCache


class Leitor:
    """Lê os tokens e escolhe o de maior pontuação. Com cache, guarda o que leu num DynamicCache; sem, não guarda nada."""
    def __init__(self, modelo, com_cache):
        self.modelo, self.com_cache = modelo, com_cache

    @torch.inference_mode()
    def ler(self, ids, cache):
        entrada = torch.tensor([ids])
        if not self.com_cache:
            saida = self.modelo(input_ids=entrada, use_cache=False)
            return saida.logits[0, -1].argmax().item(), None
        cache = cache if cache is not None else DynamicCache(config=self.modelo.config)
        # a posição de cada token novo continua de onde o cache parou
        lidos = cache.get_seq_length()
        posicoes = torch.arange(lidos, lidos + len(ids))
        saida = self.modelo(input_ids=entrada, past_key_values=cache, cache_position=posicoes, use_cache=True)
        return saida.logits[0, -1].argmax().item(), saida.past_key_values

    def bytes_do_cache(self, cache):
        return sum(t.numel() * t.element_size() for camada in cache.layers for t in (camada.keys, camada.values))
