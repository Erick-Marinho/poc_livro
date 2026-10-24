"""O primeiro agente: um grafo que lê a mensagem, decide o que o contrato manda e escreve a resposta.

Ainda sem ferramentas: ele não consulta pedido nem abre chamado de verdade. Isso chega no capítulo 3.
"""
from typing import TypedDict

from langchain_core.language_models import BaseChatModel
from langgraph.graph import END, START, StateGraph
from pydantic import BaseModel, Field

from contrato import Decisao

INSTRUCAO = """Você é o atendimento da Casa Bem-te-vi, uma loja online de utilidades para a casa.
Para cada mensagem de cliente, tome uma destas decisões:
- responder: a resposta está nos dados da loja ou na política de atendimento;
- abrir_chamado: um produto chegou com defeito, dentro do prazo;
- recusar: a loja não permite o que o cliente pede;
- passar: o caso é de uma pessoa da equipe.
Quando a política não diz, não prometa: passe a vez."""


class Escolha(BaseModel):
    """A decisão do agente para uma mensagem, e o porquê."""

    decisao: Decisao
    motivo: str = Field(description="por que esta decisão, em uma frase")


class Conversa(TypedDict, total=False):
    """O que o grafo carrega de um nó para o outro."""

    pergunta: str
    decisao: Decisao
    motivo: str
    resposta: str


def montar(modelo: BaseChatModel):
    """O grafo do agente: decidir, e depois um caminho para cada decisão do contrato."""
    escolher = modelo.with_structured_output(Escolha)

    def decidir(c: Conversa) -> Conversa:
        e = escolher.invoke([("system", INSTRUCAO), ("human", c["pergunta"])])
        return {"decisao": e.decisao, "motivo": e.motivo}

    def escrever(pedido: str):
        def no(c: Conversa) -> Conversa:
            m = modelo.invoke([("system", f"{INSTRUCAO}\n\n{pedido}"), ("human", c["pergunta"])])
            return {"resposta": m.text}
        return no

    # onde o modelo não precisa escrever, ele não escreve: o texto é sempre o mesmo
    def abrir_chamado(c: Conversa) -> Conversa:
        return {"resposta": "Sinto muito pelo problema. Ainda não abro chamado sozinho: "
                            "vou passar para uma pessoa da equipe abrir o seu."}

    def passar(c: Conversa) -> Conversa:
        return {"resposta": "Vou passar a sua mensagem para uma pessoa da equipe."}

    caminhos = {
        Decisao.RESPONDER: escrever("Responda ao cliente em poucas frases."),
        Decisao.ABRIR_CHAMADO: abrir_chamado,
        Decisao.RECUSAR: escrever("Diga ao cliente, com educação, que a loja não pode, e por quê."),
        Decisao.PASSAR: passar,
    }
    grafo = StateGraph(Conversa)
    grafo.add_node("decidir", decidir)
    for decisao, no in caminhos.items():
        grafo.add_node(decisao.value, no)
        grafo.add_edge(decisao.value, END)
    grafo.add_edge(START, "decidir")
    grafo.add_conditional_edges("decidir", lambda c: c["decisao"].value, [d.value for d in caminhos])
    return grafo.compile()
