"""O cérebro com um modelo local: a busca do cerebro.py acha as notas, e um modelo rodando no Ollama escreve a resposta.

    uv run python modelo.py "Por qual canal vai o lembrete?"
"""
import re
import sys
from dataclasses import dataclass

from langchain_ollama import ChatOllama
from pydantic import BaseModel, Field

from cerebro import Nota, bm25, dia, ler_cofre, palavras

# temperatura zero: a mesma pergunta, a mesma resposta (ou quase: o modelo ainda pode variar de uma versão para outra)
MODELO = ChatOllama(model="llama3.2:3b", temperature=0)
INSTRUCAO = ("Você responde perguntas sobre as notas de trabalho de uma pessoa. Use só as notas abaixo, numeradas. "
             "Se as notas discordam, vale a mais recente. Responda em português, em uma frase, e diga o número da nota "
             "de onde tirou a resposta.")


class Saida(BaseModel):
    frase: str = Field(description="a resposta, em uma frase")
    nota: int = Field(description="o número da nota de onde veio a resposta")


@dataclass
class RespostaDoModelo:
    frase: str
    numero: int
    nota: Nota | None   # None: o modelo citou um número que não é de nenhuma das notas que ele leu


def responder(pergunta: str, notas: list[Nota] | None = None) -> RespostaDoModelo:
    notas = notas or ler_cofre()
    pontos = bm25(notas, palavras(pergunta))
    melhores = [n for p, n in sorted(zip(pontos, notas), key=lambda x: -x[0])[:5] if p > 0]
    # cada nota vai com um número: o modelo devolve o número, e o código, que sabe o arquivo, não depende de ele copiar
    # um nome com acento (um modelo pequeno escreve Reunióes no lugar de Reuniões)
    contexto = "\n\n".join(f"[{i}] {n.arquivo} ({dia(n.data)})\n" + " ".join(n.frases) for i, n in enumerate(melhores, 1))
    saida = MODELO.with_structured_output(Saida).invoke([("system", INSTRUCAO), ("user", f"Notas:\n\n{contexto}\n\nPergunta: {pergunta}")])
    # a fonte tem que ser uma das notas que ele leu: o modelo também inventa número
    nota = melhores[saida.nota - 1] if 1 <= saida.nota <= len(melhores) else None
    return RespostaDoModelo(saida.frase, saida.nota, nota)


def datas_sem_fonte(r: RespostaDoModelo) -> list[str]:
    """As datas da resposta que a nota citada não traz: o modelo pode acertar a resposta e errar de onde ela veio."""
    texto = " ".join(r.nota.frases) if r.nota else ""
    return [d for d in re.findall(r"\d{2}/\d{2}", r.frase) if d not in texto]


if __name__ == "__main__":
    r = responder(" ".join(sys.argv[1:]))
    print(f"resposta: {r.frase}")
    print(f"fonte:    {r.nota.arquivo} ({dia(r.nota.data)})" if r.nota else f"fonte:    a nota [{r.numero}], que não é nenhuma das que ele leu")
    if r.nota and (faltam := datas_sem_fonte(r)):
        print(f"atenção:  a nota citada não diz {', '.join(faltam)}")
