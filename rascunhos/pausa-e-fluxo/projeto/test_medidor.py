"""Os testes rodam sem o Ollama: as respostas e o relógio são de mentira.

    uv run python -m unittest
"""
import json
import unittest

from medidor import ler, montar
from placar import placar


class Relogio:
    """Um relógio que marca o segundo em que cada pedaço chegou."""
    agora = 0.0

    def __call__(self):
        return self.agora


def chegando(relogio, *pares):
    """Os pedaços da resposta, cada um no seu segundo."""
    for segundo, pedaco in pares:
        relogio.agora = segundo
        yield json.dumps(pedaco)


FIM = {"done": True, "prompt_eval_count": 600, "prompt_eval_cached_count": 450, "eval_count": 64, "eval_duration": 4_000_000_000}


class MedidorTest(unittest.TestCase):
    def test_a_pausa_acaba_no_primeiro_pedaco_com_texto(self):
        relogio = Relogio()
        pedacos = chegando(relogio, (1.0, {"response": ""}), (2.5, {"response": "O"}), (2.7, {"response": " pedido"}), (6.5, FIM))
        self.assertEqual(ler(pedacos, 0.0, relogio)["pausa"], 2.5)

    def test_as_contas_vem_do_ultimo_pedaco(self):
        relogio = Relogio()
        medida = ler(chegando(relogio, (2.0, {"response": "O"}), (6.0, FIM)), 0.0, relogio)
        self.assertEqual((medida["fluxo"], medida["lidos"], medida["do_cache"], medida["escritos"]), (16.0, 600, 450, 64))

    def test_sem_o_campo_do_cache_nada_veio_dele(self):
        relogio = Relogio()
        fim = {k: v for k, v in FIM.items() if k != "prompt_eval_cached_count"}
        self.assertEqual(ler(chegando(relogio, (2.0, {"response": "O"}), (6.0, fim)), 0.0, relogio)["do_cache"], 0)

    def test_resposta_cortada_e_erro(self):
        relogio = Relogio()
        with self.assertRaises(RuntimeError):
            ler(chegando(relogio, (2.0, {"response": "O"})), 0.0, relogio)

    def test_o_texto_le_o_material_e_termina_na_pergunta(self):
        curta = montar({"material": [], "pergunta": "Já saiu?"})
        longa = montar({"material": ["politica.md", "pedidos.json"], "pergunta": "Já saiu?"})
        self.assertEqual(curta, "Pergunta: Já saiu?")
        self.assertTrue(longa.startswith("# Política de atendimento") and longa.endswith("\n\nPergunta: Já saiu?"))


def rodada(curta, longa, de_novo):
    """Cada medida como (pausa, fluxo, tokens do cache)."""
    medida = lambda p, f, c: {"pausa": p, "fluxo": f, "do_cache": c}  # noqa: E731
    return {"curta": medida(*curta), "longa": medida(*longa), "de_novo": medida(*de_novo)}


class PlacarTest(unittest.TestCase):
    def test_conta_cada_parte_da_afirmacao(self):
        rodadas = [
            rodada((0.5, 10.0, 0), (6.0, 8.0, 0), (1.0, 8.0, 450)),   # tudo se confirma; o fluxo cai 20%, no limite
            rodada((0.5, 10.0, 0), (6.0, 7.9, 0), (6.1, 7.9, 0)),     # o fluxo cai mais que 20%; sem cache
            rodada((0.5, 10.0, 0), (0.4, 10.0, 0), (0.3, 10.0, 0)),   # a longa não demorou mais; mais rápida, mas sem cache
        ]
        self.assertEqual(placar(rodadas), [
            "a pausa da longa foi maior que a da curta: 2 de 3 (67%)",
            "o fluxo da longa ficou a até 20% do da curta: 2 de 3 (67%)",
            "a longa pedida de novo começou mais rápido, lendo do cache: 1 de 3 (33%)",
        ])


if __name__ == "__main__":
    unittest.main()
