"""O que uma pessoa ficou de fazer, seguindo os [[links]] do cofre: as notas que citam a pessoa (os backlinks do
Obsidian), as frases com "ficou de" nelas, e o que uma nota mais nova disse depois sobre o mesmo assunto.

    uv run python pessoas.py "Rafael Souza"
"""
import re
import sys

from cerebro import COFRE, dia, ler_cofre, palavras


def citam(pessoa: str) -> list:
    """As notas que têm um [[link]] para a pessoa: o painel de backlinks dela, no Obsidian."""
    return [n for n in ler_cofre() if f"[[{pessoa}]]" in (COFRE / n.arquivo).read_text(encoding="utf-8")]


def compromissos(pessoa: str) -> list[tuple]:
    """Cada frase "ficou de" sobre a pessoa (pelo nome, ou por um "Ele"/"Ela" logo depois de citar ela), com a nota."""
    nome = pessoa.split()[0]
    return [(n, f) for n in citam(pessoa) for f in n.frases if "ficou de" in f and (nome in f or re.match(r"(Ele|Ela) ", f))]


def depois(pessoa: str, nota, frase: str):
    """A frase de uma nota mais nova, entre as que citam a pessoa, que mais fala do mesmo assunto (duas palavras, ao menos)."""
    assunto = set(palavras(frase)) - set(palavras(pessoa + " ficou ate"))
    candidatas = [(len(assunto & set(palavras(f))), n, f) for n in citam(pessoa) if n.data > nota.data for f in n.frases]
    melhor = max(candidatas, key=lambda x: x[0], default=None)
    return melhor if melhor and melhor[0] >= 2 else None


if __name__ == "__main__":
    pessoa = " ".join(sys.argv[1:])
    lista = compromissos(pessoa)
    print(f"{pessoa}: {len(lista)} {'compromisso' if len(lista) == 1 else 'compromissos'}, em {len(citam(pessoa))} notas que citam {pessoa.split()[0]}")
    for nota, frase in lista:
        print(f"{dia(nota.data)}  {frase}  ({nota.arquivo})")
        d = depois(pessoa, nota, frase)
        print(f"       depois, {dia(d[1].data)}: {d[2]}  ({d[1].arquivo})" if d else "       depois: nenhuma nota mais nova fala disso")
