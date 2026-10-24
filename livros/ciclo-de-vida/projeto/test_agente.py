"""O grafo do agente, testado sem chamar modelo nenhum: um modelo falso devolve respostas combinadas."""
from langchain_core.language_models.fake_chat_models import GenericFakeChatModel
from langchain_core.messages import AIMessage

from agente import montar
from contrato import Decisao


class ModeloFalso(GenericFakeChatModel):
    """O modelo falso da LangChain não sabe usar ferramentas; a saída estruturada usa uma, então ele finge que sabe."""

    def bind_tools(self, tools, **kwargs):
        return self


def falso(decisao: Decisao, *textos: str) -> ModeloFalso:
    """Um modelo que primeiro escolhe `decisao` e depois, se pedirem, escreve cada um dos `textos`. Nada além disso."""
    escolha = AIMessage(content="", tool_calls=[{"name": "Escolha", "args": {"decisao": decisao, "motivo": "teste"}, "id": "1"}])
    return ModeloFalso(messages=iter([escolha, *(AIMessage(content=t) for t in textos)]))


def test_o_grafo_tem_um_caminho_para_cada_decisao():
    nos = set(montar(falso(Decisao.PASSAR)).get_graph().nodes)
    assert nos == {"__start__", "decidir", *(d.value for d in Decisao), "__end__"}


def test_responder_escreve_com_o_modelo():
    fim = montar(falso(Decisao.RESPONDER, "Seu pedido sai amanhã.")).invoke({"pergunta": "Cadê o BT-1002?"})
    assert fim["decisao"] == Decisao.RESPONDER
    assert fim["resposta"] == "Seu pedido sai amanhã."


def test_recusar_escreve_com_o_modelo():
    fim = montar(falso(Decisao.RECUSAR, "Não damos desconto.")).invoke({"pergunta": "Me dá 10%?"})
    assert fim["resposta"] == "Não damos desconto."


def test_passar_e_abrir_chamado_nao_chamam_o_modelo_de_novo():
    # o modelo falso só tem a escolha: se o caminho pedisse um texto, ele não teria o que devolver e o teste falharia
    for decisao, trecho in [(Decisao.PASSAR, "pessoa da equipe"), (Decisao.ABRIR_CHAMADO, "abrir o seu")]:
        fim = montar(falso(decisao)).invoke({"pergunta": "Quero falar com alguém."})
        assert fim["decisao"] == decisao
        assert trecho in fim["resposta"]
