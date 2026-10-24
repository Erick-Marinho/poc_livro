"""A nota do agente: o grafo do capítulo 2, com Claude, contra as 20 perguntas de referência.

Precisa da chave da Anthropic no ambiente (ANTHROPIC_API_KEY). Cada pergunta passa pelo agente inteiro: ele decide e,
quando a decisão pede, escreve a resposta. A régua é a mesma da nota de partida.
"""
from langchain_anthropic import ChatAnthropic

from agente import montar
from baseline import avaliar
from contrato import carregar_referencia

MODELO = "claude-haiku-5-5"


if __name__ == "__main__":
    agente = montar(ChatAnthropic(model=MODELO, temperature=0, max_tokens=1024))
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
