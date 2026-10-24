"""A nota do agente: o grafo do capítulo 2, com o GPT-6 Luna, contra as 20 perguntas de referência.

Precisa da chave da OpenAI no ambiente (OPENAI_API_KEY). Cada pergunta passa pelo agente inteiro: ele decide e,
quando a decisão pede, escreve a resposta. A régua é a mesma da nota de partida.
"""
from langchain_openai import ChatOpenAI

from agente import montar
from baseline import avaliar
from contrato import carregar_referencia

MODELO = "gpt-6-luna"


if __name__ == "__main__":
    # sem temperature: fica o padrão do modelo; max_tokens limita o gasto de cada resposta
    agente = montar(ChatOpenAI(model=MODELO, max_tokens=4096))
    casos = carregar_referencia()
    decidiu = {}

    def decidir(pergunta: str):
        decidiu[pergunta] = agente.invoke({"pergunta": pergunta})["decisao"]
        return decidiu[pergunta]

    placar = avaliar(decidir, casos)
    for d, (certos, total) in placar.items():
        print(f"{d:<14} {certos:>2} de {total:>2}")
    acertos = sum(c for c, _ in placar.values())
    print(f"nota do agente: {acertos} de {len(casos)} ({acertos / len(casos):.0%})")
    for c in casos:
        if decidiu[c.pergunta] != c.decisao:
            print(f"  {c.id}: o contrato pede {c.decisao}, o agente decidiu {decidiu[c.pergunta]}")
