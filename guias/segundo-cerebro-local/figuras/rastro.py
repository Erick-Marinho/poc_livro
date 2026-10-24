"""O caminho de uma pergunta pelo cérebro, para a figura do guia: cada etapa do cerebro.py, com os números.

    uv run python ../figuras/rastro.py "Quando é a entrega do piloto?"   (de dentro de projeto/)

Refaz os passos do responder() para mostrar o meio do caminho, e confere no fim que chegou às mesmas respostas que
ele, com e sem a data: se o cerebro.py mudar e o rastro não, este script falha, e o livro não monta.
"""
import json
import sys
from pathlib import Path

sys.path.insert(0, str(Path.cwd()))
from cerebro import PARECIDA, bm25, dia, ler_cofre, palavras, responder  # noqa: E402

pergunta = sys.argv[1]
notas = ler_cofre()
consulta = palavras(pergunta)
pontos = bm25(notas, consulta)
ordem = sorted(zip(pontos, notas), key=lambda x: -x[0])
melhores = [n for p, n in ordem[:5] if p > 0]
frases = [(len(set(consulta) & set(palavras(f))), n, f) for n in melhores for f in n.frases]
topo = max(x[0] for x in frases)
boas = sorted((x for x in frases if x[0] >= topo * PARECIDA), key=lambda x: (x[1].data, x[0]), reverse=True)

sem, com = responder(pergunta, False, notas), responder(pergunta, True, notas)
assert (sem.frase, sem.nota.arquivo) == (max((x for x in frases if x[1] is melhores[0]), key=lambda x: x[0])[2], melhores[0].arquivo), "o rastro sem a data divergiu do cerebro.py"
assert (com.frase, com.nota.arquivo) == (boas[0][2], boas[0][1].arquivo), "o rastro com a data divergiu do cerebro.py"

print(json.dumps({
    "pergunta": pergunta,
    "palavras": consulta,
    "notas": [{"arquivo": n.arquivo, "titulo": n.titulo, "data": dia(n.data), "pontos": round(p, 2), "achada": n in melhores} for p, n in ordem],
    "frases": [{"palavras": k, "nota": n.arquivo, "data": dia(n.data), "frase": f} for k, n, f in sorted(frases, key=lambda x: -x[0]) if k > 0],
    "topo": topo,
    "sem_data": {"frase": sem.frase, "nota": sem.nota.arquivo, "data": dia(sem.nota.data)},
    "com_data": {"frase": com.frase, "nota": com.nota.arquivo, "data": dia(com.nota.data),
                 "antes": {"frase": com.antes[0], "nota": com.antes[1].arquivo, "data": dia(com.antes[1].data)} if com.antes else None},
}, ensure_ascii=False))
