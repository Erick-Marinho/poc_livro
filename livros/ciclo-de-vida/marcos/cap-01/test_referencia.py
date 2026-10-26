"""As perguntas de referência estão válidas e de acordo com os dados da loja?"""
from datetime import date

import pytest

from contrato import AQUI, Decisao, carregar, carregar_referencia

CASOS = carregar_referencia()
CASOS_DO_LEITOR = AQUI / "meus-casos.jsonl"
if CASOS_DO_LEITOR.exists():
    CASOS += carregar_referencia(CASOS_DO_LEITOR)
PEDIDOS = {p["id"]: p for p in carregar("pedidos")}
EMAIL = {c["id"]: c["email"] for c in carregar("clientes")}
HOJE = date.fromisoformat(carregar("loja")["hoje"])


def dono(pedido):
    return EMAIL[PEDIDOS[pedido]["cliente"]]


def test_ids_unicos_e_em_ordem():
    assert [c.id for c in CASOS] == [f"R{i:02d}" for i in range(1, len(CASOS) + 1)]


def test_as_quatro_decisoes_aparecem():
    assert {c.decisao for c in CASOS} == set(Decisao)


def test_todo_pedido_citado_existe():
    assert all(c.pedido in PEDIDOS for c in CASOS if c.pedido)


def test_so_responde_sobre_pedido_quando_o_email_bate():
    for c in CASOS:
        if c.pedido and c.decisao in (Decisao.RESPONDER, Decisao.ABRIR_CHAMADO):
            assert c.email == dono(c.pedido), f"{c.id}: o e-mail não é do dono do pedido"


def test_existe_um_caso_de_pedido_de_outra_pessoa():
    """É o caso que o capítulo 6 vai usar para quebrar o agente de propósito."""
    assert any(c.pedido and c.email != dono(c.pedido) and c.decisao == Decisao.RECUSAR for c in CASOS)


def test_chamado_so_para_pedido_entregue_ha_menos_de_90_dias():
    for c in CASOS:
        if c.decisao == Decisao.ABRIR_CHAMADO:
            p = PEDIDOS[c.pedido]
            assert p["status"] == "entregue", f"{c.id}: pedido não foi entregue"
            assert (HOJE - date.fromisoformat(p["entregue_em"])).days <= 90, f"{c.id}: passou dos 90 dias"


def test_linha_invalida_diz_qual_linha(tmp_path):
    arquivo = tmp_path / "ruim.jsonl"
    arquivo.write_text('{"id": "R01", "pergunta": "Oi, tudo bem?", "decisao": "talvez", "motivo": "não existe"}\n', encoding="utf-8")
    with pytest.raises(ValueError, match="linha 1"):
        carregar_referencia(arquivo)
