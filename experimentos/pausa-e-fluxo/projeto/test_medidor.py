"""Os testes são executados sem o Ollama: as respostas e o relógio são de mentira.

    uv run python -m unittest
"""
import json
import unittest

from medidor import ler, montar


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


class LerTest(unittest.TestCase):
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


class MontarTest(unittest.TestCase):
    def test_o_texto_le_o_material_e_termina_na_pergunta(self):
        curta = montar({"material": [], "pergunta": "Já saiu?"}, 1)
        longa = montar({"material": ["politica.md", "pedidos.json"], "pergunta": "Já saiu?"}, 2)
        self.assertEqual(curta, "Atendimento 1.\n\nPergunta: Já saiu?")
        self.assertTrue(longa.startswith("Atendimento 2.\n\n# Política de atendimento") and longa.endswith("\n\nPergunta: Já saiu?"))

    def test_cada_atendimento_comeca_diferente_para_nao_reaproveitar_o_cache(self):
        longa = {"material": ["politica.md"], "pergunta": "Já saiu?"}
        primeira, segunda = montar(longa, 3), montar(longa, 4)
        self.assertNotEqual(primeira[:14], segunda[:14], "o começo é o que o cache reaproveita")
        self.assertEqual(primeira[14:], segunda[14:], "o resto é o mesmo texto")


from placar import placar  # noqa: E402  (o placar vem depois do medidor)


def vez(curta, longa, de_novo):
    """Cada medida como (pausa, fluxo, tokens do cache); o modelo leu 1000 tokens em cada uma."""
    medida = lambda p, f, c: {"pausa": p, "fluxo": f, "do_cache": c, "lidos": 1000}  # noqa: E731
    return {"curta": medida(*curta), "longa": medida(*longa), "de_novo": medida(*de_novo)}


class PlacarTest(unittest.TestCase):
    def test_conta_cada_parte_da_afirmacao(self):
        repeticoes = [
            vez((0.5, 10.0, 20), (6.0, 8.0, 20), (1.0, 8.0, 999)),  # tudo se confirma; o fluxo cai 20%, no limite
            vez((0.5, 10.0, 20), (6.0, 7.9, 20), (6.1, 7.9, 20)),   # o fluxo cai mais que 20%; só o começo fixo do cache
            vez((0.5, 10.0, 20), (0.4, 10.0, 20), (0.3, 10.0, 20)), # a longa não demorou mais; mais rápida, mas sem cache
        ]
        self.assertEqual(placar(repeticoes), [
            "a pausa da longa foi maior que a da curta: 2 de 3 (67%)",
            "o fluxo da longa ficou a até 20% do da curta: 2 de 3 (67%)",
            "a longa pedida de novo começou mais rápido, lendo do cache: 1 de 3 (33%)",
        ])

    def test_o_comeco_fixo_do_cache_nao_conta_como_cache(self):
        mais_rapida_com_20_do_cache = vez((0.5, 10.0, 20), (6.0, 9.0, 20), (5.0, 9.0, 20))
        self.assertIn("lendo do cache: 0 de 1 (0%)", placar([mais_rapida_com_20_do_cache])[2])


if __name__ == "__main__":
    unittest.main()
