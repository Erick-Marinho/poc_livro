"""Um segundo cérebro em cima de um cofre do Obsidian: acha as notas da pergunta e responde com a frase e a fonte.

    uv run python cerebro.py "Quando é a entrega do piloto?"
"""
import math
import re
import sys
import unicodedata
from dataclasses import dataclass
from datetime import date
from pathlib import Path

COFRE = Path(__file__).parent / "cofre"
# quão perto da melhor frase uma frase precisa chegar para disputar pela data (1.0: só as que empatam com ela)
PARECIDA = 1.0
VAZIAS = set("a o as os de da do das dos e é em no na nos nas um uma para por que qual quem quando como com se ao vai foi".split())


def palavras(texto: str) -> list[str]:
    """Minúsculas, sem acento, sem as palavras que não dizem nada sozinhas."""
    t = unicodedata.normalize("NFKD", texto.lower()).encode("ascii", "ignore").decode()
    return [p for p in re.findall(r"[a-z0-9]+", t) if p not in VAZIAS and len(p) > 1]


@dataclass
class Nota:
    arquivo: str
    data: date
    titulo: str
    frases: list[str]


def ler_cofre(pasta: Path = COFRE) -> list[Nota]:
    """Cada .md do cofre: a data das propriedades, o título e as frases (um [[link]] vira só o nome)."""
    notas = []
    for f in sorted(pasta.rglob("*.md")):
        _, topo, corpo = f.read_text(encoding="utf-8").split("---\n", 2)
        data = date.fromisoformat(re.search(r"data: (\S+)", topo).group(1))
        corpo = re.sub(r"\[\[([^\]]+)\]\]", r"\1", corpo)
        titulo = re.search(r"^# (.+)$", corpo, re.M).group(1)
        frases = [s.strip() for s in re.split(r"(?<=\.)\s+|\n+", corpo) if s.strip() and not s.startswith("#")]
        notas.append(Nota(str(f.relative_to(pasta)), data, titulo, frases))
    return notas


def bm25(notas: list[Nota], consulta: list[str], k1: float = 1.5, b: float = 0.75) -> list[float]:
    """Quão parecida cada nota é com a pergunta: palavra rara vale mais, nota comprida não ganha por ser comprida."""
    docs = [palavras(n.titulo + " " + " ".join(n.frases)) for n in notas]
    media = sum(map(len, docs)) / len(docs)
    idf = {p: math.log(1 + (len(docs) - sum(p in d for d in docs) + 0.5) / (sum(p in d for d in docs) + 0.5)) for p in set(consulta)}
    return [sum(idf[p] * d.count(p) * (k1 + 1) / (d.count(p) + k1 * (1 - b + b * len(d) / media)) for p in idf) for d in docs]


@dataclass
class Resposta:
    frase: str
    nota: Nota
    antes: tuple[str, Nota] | None = None


def responder(pergunta: str, com_data: bool = True, notas: list[Nota] | None = None) -> Resposta:
    notas = notas or ler_cofre()
    consulta = palavras(pergunta)
    pontos = bm25(notas, consulta)
    melhores = [n for p, n in sorted(zip(pontos, notas), key=lambda x: -x[0])[:5] if p > 0]
    # cada frase das notas achadas, com quantas palavras da pergunta ela tem
    frases = [(len(set(consulta) & set(palavras(f))), n, f) for n in melhores for f in n.frases]
    if not com_data:
        nota = melhores[0]
        _, _, frase = max((x for x in frases if x[1] is nota), key=lambda x: x[0])
        return Resposta(frase, nota)
    # com a data: entre as frases mais parecidas com a pergunta, vale a da nota mais recente
    topo = max(x[0] for x in frases)
    boas = sorted((x for x in frases if x[0] >= topo * PARECIDA), key=lambda x: (x[1].data, x[0]), reverse=True)
    _, nota, frase = boas[0]
    velha = next(((f, n) for _, n, f in boas[1:] if n.data < nota.data and f != frase), None)
    return Resposta(frase, nota, velha)


def dia(d: date) -> str:
    return d.strftime("%d/%m")


if __name__ == "__main__":
    com_data = "--sem-data" not in sys.argv   # --sem-data: a busca ingênua, para comparar
    pergunta = " ".join(a for a in sys.argv[1:] if a != "--sem-data")
    r = responder(pergunta, com_data)
    print(f"resposta: {r.frase}")
    print(f"fonte:    {r.nota.arquivo} ({dia(r.nota.data)})")
    if r.antes:
        print(f"antes:    {r.antes[0]} ({r.antes[1].arquivo}, {dia(r.antes[1].data)})")
