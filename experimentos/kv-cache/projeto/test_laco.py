"""Os testes são executados sem o PyTorch: o modelo e o relógio são de mentira.

    uv run python -m unittest
"""
import unittest

from laco import bytes_esperados, gerar
from placar import placar


class Modelo:
    """Um modelo de mentira: o próximo token depende de tudo o que ele tem em mente (o cache e o que acabou de ler)."""
    def __init__(self):
        self.recebeu_cache = []

    def ler(self, ids, cache):
        self.recebeu_cache.append(cache is not None)
        contexto = (cache or []) + ids
        return sum(i * (p + 1) for p, i in enumerate(contexto)) % 97, contexto

    def bytes_do_cache(self, cache):
        return 4 * len(cache)


class Relogio:
    """Cada leitura dura um segundo a mais que a anterior."""
    def __init__(self):
        self.agora, self.chamadas = 0.0, 0

    def __call__(self):
        self.chamadas += 1
        if self.chamadas % 2 == 0:
            self.agora += self.chamadas / 2
        return self.agora


ENTRADA = [5, 8, 13, 21]


class LacoTest(unittest.TestCase):
    def test_com_cache_le_a_mensagem_e_depois_so_o_token_novo(self):
        r = gerar(Modelo(), ENTRADA, com_cache=True, novos=5)
        self.assertEqual(r["lidos"], [4, 1, 1, 1, 1])
        self.assertEqual(r["cache_bytes"], [16, 20, 24, 28, 32])

    def test_sem_cache_rele_tudo_e_nunca_recebe_cache(self):
        modelo = Modelo()
        r = gerar(modelo, ENTRADA, com_cache=False, novos=5)
        self.assertEqual(r["lidos"], [4, 5, 6, 7, 8])
        self.assertEqual(modelo.recebeu_cache, [False] * 5)
        self.assertEqual(r["cache_bytes"], [0] * 5)

    def test_os_dois_modos_dao_o_mesmo_contexto_e_os_mesmos_tokens(self):
        com = gerar(Modelo(), ENTRADA, com_cache=True, novos=20)
        sem = gerar(Modelo(), ENTRADA, com_cache=False, novos=20)
        self.assertEqual(com["tokens"], sem["tokens"])

    def test_o_relogio_marca_cada_leitura(self):
        r = gerar(Modelo(), ENTRADA, com_cache=True, novos=3, relogio=Relogio())
        self.assertEqual(r["tempos"], [1.0, 2.0, 3.0])

    def test_gera_depois_do_fim_e_registra_onde_a_resposta_acabou(self):
        tokens = gerar(Modelo(), ENTRADA, com_cache=True, novos=10)["tokens"]
        r = gerar(Modelo(), ENTRADA, com_cache=True, novos=10, fim=tokens[3])
        self.assertEqual(len(r["tokens"]), 10)
        self.assertEqual(r["fim"], tokens.index(tokens[3]))


class BytesTest(unittest.TestCase):
    def test_os_40_gib_do_daily_dose(self):
        # Llama 3.3 70B: 80 camadas, 8 cabeças K/V de 128 números, bfloat16 (2 bytes), 131.072 tokens
        self.assertEqual(bytes_esperados(80, 8, 128, 2, 131_072), 40 * 2**30)


def registro(tempos, tokens=(1, 2)):
    return {"tempos": [99.0] + list(tempos), "tokens": list(tokens)}


def repeticao(rampa_fim=2.0, longa_sem=10.0, longa_com=1.2, iguais=True):
    """Passos de escrita de 1 s na curta com cache; os outros, pelos parâmetros."""
    curta_sem = [1.0] * 16 + [rampa_fim] * 16
    return {
        "curta": {"com": registro([1.0] * 32), "sem": registro(curta_sem)},
        "longa": {"com": registro([longa_com] * 32), "sem": registro([longa_com * longa_sem] * 32, (1, 2) if iguais else (1, 3))},
    }


class PlacarTest(unittest.TestCase):
    def test_no_limite_conta(self):
        self.assertEqual(placar([repeticao()]), [
            "sem cache, a escrita da curta ficou ao menos 2 vezes mais cara no fim: 1 de 1 (100%)",
            "na longa, o passo sem cache custou ao menos 10 vezes o com cache: 1 de 1 (100%)",
            "com cache, o passo da longa ficou a até 20% do da curta: 1 de 1 (100%)",
            "os mesmos tokens com e sem cache: 2 de 2 (100%)",
        ])

    def test_abaixo_do_limite_nao_conta(self):
        linhas = placar([repeticao(rampa_fim=1.99, longa_sem=9.9, longa_com=1.21, iguais=False)])
        self.assertTrue(all(" 0 de 1 " in l for l in linhas[:3]), linhas)
        self.assertIn("1 de 2", linhas[3])

    def test_o_passo_0_a_pausa_fica_fora(self):
        r = repeticao()
        r["longa"]["com"]["tempos"][0] = 10_000.0
        self.assertIn("1 de 1", placar([r])[1])
