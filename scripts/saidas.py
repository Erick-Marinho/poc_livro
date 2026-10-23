"""Roda os comandos de um livro no projeto real e grava o que o terminal mostrou.

    python3 scripts/saidas.py <livro>              grava livros/<livro>/saidas.json
    python3 scripts/saidas.py <livro> --conferir   roda de novo e falha se a saída mudou

Os comandos ficam em livros/<livro>/comandos.json. Cada um roda dentro de livros/<livro>/projeto,
depois de um `uv sync`. O caminho da máquina vira o caminho do leitor, e os tempos (como
"in 0.63s") não contam na conferência. Saída 0: tudo certo. 1: alguma saída mudou. 2: uso errado.
"""
import json
import re
import subprocess
import sys
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
RUIDO = re.compile(r"^warning: The `UV_\w+` environment variable is deprecated")   # aviso do ambiente, não do projeto
TEMPO = re.compile(r"\bin \d+\.\d+s\b")


def classe(linha: str) -> str:
    if re.search(r"\b\d+ passed\b", linha) and not re.search(r"\b(failed|error)\b", linha):
        return "okv"
    if re.match(r"^(FAILED|ERROR|E  |Traceback)|\b\d+ (failed|errors?)\b", linha):
        return "err"
    return ""


def rodar(livro: str) -> dict:
    base = RAIZ / "livros" / livro
    conf = json.loads((base / "comandos.json").read_text(encoding="utf-8"))
    projeto = base / "projeto"
    subprocess.run(["uv", "sync", "--quiet"], cwd=projeto, check=True)
    saidas = {}
    for chave, c in conf["comandos"].items():
        r = subprocess.run(["bash", "-c", c["comando"]], cwd=projeto, capture_output=True, text=True)
        texto = (r.stdout + r.stderr).replace(str(projeto), conf["pasta_do_leitor"])
        linhas = [l for l in texto.rstrip("\n").split("\n") if not RUIDO.match(l)]
        saidas[chave] = {"comando": c["comando"], "saiu_com": r.returncode, "saida": [[l, classe(l)] for l in linhas]}
        esperado = c.get("saiu_com", 0)
        if r.returncode != esperado:
            print(f"aviso: {chave} saiu com {r.returncode}, o esperado era {esperado}", file=sys.stderr)
    return saidas


def sem_tempo(saidas: dict) -> dict:
    return {k: {**v, "saida": [[TEMPO.sub("in …s", l), c] for l, c in v["saida"]]} for k, v in saidas.items()}


def principal(argv: list[str]) -> int:
    if not argv or argv[0].startswith("-"):
        print(__doc__, file=sys.stderr)
        return 2
    livro, conferir = argv[0], "--conferir" in argv
    arquivo = RAIZ / "livros" / livro / "saidas.json"
    novas = rodar(livro)
    if not conferir:
        arquivo.write_text(json.dumps(novas, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        print(f"gravadas {len(novas)} saídas em {arquivo.relative_to(RAIZ)}")
        return 0
    gravadas = json.loads(arquivo.read_text(encoding="utf-8"))
    a, b = sem_tempo(gravadas), sem_tempo(novas)
    mudou = sorted(set(a) ^ set(b)) + [k for k in a if k in b and a[k] != b[k]]
    for k in mudou:
        print(f"mudou: {k}", file=sys.stderr)
        for l, _ in b.get(k, {}).get("saida", []):
            print(f"    {l}", file=sys.stderr)
    if mudou:
        print("a saída do código não é mais a que o livro mostra: confira e, se estiver certo, grave de novo", file=sys.stderr)
        return 1
    print(f"conferidas {len(novas)} saídas: iguais às do livro")
    return 0


if __name__ == "__main__":
    sys.exit(principal(sys.argv[1:]))
