import copy
import json
import unittest
from pathlib import Path

from comparar import primeiro_desvio, resumo
from numeros import escolhas, escolher, somas
from validar import validar


class ComparadorTest(unittest.TestCase):
    def test_igual_e_primeiro_token(self):
        self.assertIsNone(primeiro_desvio([1, 2], [1, 2]))
        self.assertEqual(primeiro_desvio([1, 2], [7, 2]), 0)

    def test_fim_tambem_diverge(self):
        self.assertEqual(primeiro_desvio([1, 2], [1]), 1)
        self.assertEqual(primeiro_desvio([], [1]), 0)

    def test_conta_ids_sem_normalizar(self):
        r = resumo([[1, 2], [1, 2], [1]], [1, 2])
        self.assertEqual((r["iguais"], r["total"], r["unicas"]), (2, 3, 2))
        with self.assertRaises(ValueError):
            resumo([], [])

    def test_margem_e_desempate(self):
        self.assertEqual(escolhas(), [1, 0])
        self.assertEqual(escolhas(2), [1, 1])
        self.assertEqual(escolher([1, 1]), 0)

    def test_controles_da_soma(self):
        self.assertEqual(somas(), (1024, 1025))
        self.assertEqual(somas(1), (1026, 1026))
        self.assertEqual(len({somas() for _ in range(1000)}), 1)


class ColetaTest(unittest.TestCase):
    def setUp(self):
        self.coleta = json.loads(Path("coleta-cpu.json").read_text())

    def test_coleta_real_completa(self):
        validar(self.coleta)
        cfg = json.loads(Path("configuracao.json").read_text())
        self.assertEqual(self.coleta["configuracao"], cfg)
        corpus = [json.loads(l) for l in Path("casos.jsonl").read_text().splitlines()]
        self.assertEqual([(c["id"], c["pergunta"]) for c in self.coleta["casos"]],
                         [(c["id"], c["pergunta"]) for c in corpus])

    def test_recusa_denominador_incompleto(self):
        c = copy.deepcopy(self.coleta)
        c["casos"][0]["lotes"][0]["sequencias"].pop()
        with self.assertRaisesRegex(ValueError, "faltam repetições"):
            validar(c)

    def test_recusa_mudanca_de_entrada(self):
        c = copy.deepcopy(self.coleta)
        c["casos"][0]["lotes"][1]["entrada"].append(123)
        with self.assertRaisesRegex(ValueError, "entrada alvo mudou"):
            validar(c)

    def test_recusa_amostragem(self):
        c = copy.deepcopy(self.coleta)
        c["ambiente"]["amostragem"] = True
        with self.assertRaisesRegex(ValueError, "usou amostragem"):
            validar(c)


if __name__ == "__main__":
    unittest.main()
