"""Roda os comandos de um livro no projeto real e grava o que o terminal mostrou.

    python3 scripts/saidas.py <livro>              grava livros/<livro>/saidas.json
    python3 scripts/saidas.py <livro> --conferir   roda de novo e falha se a saída mudou

Os comandos ficam em livros/<livro>/comandos.json. Cada um roda dentro de livros/<livro>/projeto,
depois de um `uv sync`. O caminho da máquina vira o caminho do leitor, e os tempos (como
"in 0.63s") e os endereços de memória (como "at 0x7f3a…") não contam na conferência. Saída 0: tudo certo. 1: alguma saída mudou. 2: uso errado.

Os roteiros de construção (livros/<livro>/roteiros/*.json) contam o caminho do código na ordem em que se
pensa, com os erros do caminho. Cada um é aplicado numa pasta vazia: copiar, escrever, inserir, trocar e
rodar. Cada `rodar` grava a saída no estado em que o código está naquele passo, e no fim a pasta tem que
ser igual ao projeto/, arquivo por arquivo. Um roteiro que não chega ao projeto real não monta o livro.
"""
import json
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
RUIDO = re.compile(r"^warning: The `UV_\w+` environment variable is deprecated")   # aviso do ambiente, não do projeto
TEMPO = re.compile(r"\bin \d+\.\d+s\b")
ENDERECO = re.compile(r"\bat 0x[0-9a-f]+\b")   # endereço de memória que o Python imprime: muda a cada execução


def classe(linha: str) -> str:
    if re.search(r"\b\d+ passed\b", linha) and not re.search(r"\b(failed|error)\b", linha):
        return "okv"
    if re.match(r"^(FAILED|ERROR|E  |Traceback)|\b\d+ (failed|errors?)\b", linha):
        return "err"
    return ""


def executar(comando: str, pasta: Path, leitor: str) -> tuple[int, list]:
    r = subprocess.run(["bash", "-c", comando], cwd=pasta, capture_output=True, text=True)
    texto = (r.stdout + r.stderr).replace(str(pasta), leitor)
    linhas = [l for l in texto.rstrip("\n").split("\n") if not RUIDO.match(l)]
    return r.returncode, [[l, classe(l)] for l in linhas]


class RoteiroErrado(Exception):
    """O roteiro pede algo que não dá para fazer no estado em que o código está, ou não chega ao projeto real."""


def montar_partes(partes: list, final: Path, onde: str) -> str:
    """Junta o texto de um passo: trechos literais e faixas de linhas do arquivo final do projeto."""
    texto = ""
    for parte in partes:
        if "texto" in parte:
            texto += parte["texto"]
            continue
        de, ate = (int(n) for n in parte["linhas"].split("-"))
        linhas = final.read_text(encoding="utf-8").split("\n")
        if final.read_text(encoding="utf-8").endswith("\n"):
            linhas = linhas[:-1]
        if not 1 <= de <= ate <= len(linhas):
            raise RoteiroErrado(f"{onde}: linhas {de}-{ate} fora de {final.name} ({len(linhas)} linhas)")
        texto += "\n".join(linhas[de - 1:ate]) + "\n"
    return texto


def arquivos(pasta: Path) -> dict[str, bytes]:
    fora = {".venv", "__pycache__", ".pytest_cache"}
    return {str(p.relative_to(pasta)): p.read_bytes() for p in sorted(pasta.rglob("*"))
            if p.is_file() and not fora & set(p.relative_to(pasta).parts)}


def construir(livro: str, roteiro: Path, leitor: str) -> dict:
    """Aplica um roteiro numa pasta vazia e grava a saída de cada `rodar` no estado daquele passo."""
    projeto = RAIZ / "livros" / livro / "projeto"
    passos = json.loads(roteiro.read_text(encoding="utf-8"))["passos"]
    saidas, sincronizado = {}, False
    with tempfile.TemporaryDirectory(prefix="roteiro-") as tmp:
        pasta = Path(tmp)
        for n, passo in enumerate(passos, start=1):
            onde, acao = f"{roteiro.name}, passo {n} ({passo['acao']})", passo["acao"]
            if acao == "copiar":
                for nome in passo["arquivos"]:
                    (pasta / nome).parent.mkdir(parents=True, exist_ok=True)
                    shutil.copyfile(projeto / nome, pasta / nome)
                continue
            if acao == "rodar":
                if not sincronizado:
                    subprocess.run(["uv", "sync", "--quiet"], cwd=pasta, check=True)
                    sincronizado = True
                codigo, linhas = executar(passo["comando"], pasta, leitor)
                if codigo != passo.get("espera", 0):
                    raise RoteiroErrado(f"{onde}: {passo['id']} saiu com {codigo}, o roteiro espera {passo.get('espera', 0)}\n"
                                        + "\n".join(f"    {l}" for l, _ in linhas))
                saidas[passo["id"]] = {"comando": passo["comando"], "saiu_com": codigo, "saida": linhas}
                continue
            alvo = pasta / passo["arquivo"]
            final = projeto / passo["arquivo"]
            atual = alvo.read_text(encoding="utf-8") if alvo.exists() else ""
            if acao == "escrever":
                alvo.parent.mkdir(parents=True, exist_ok=True)
                alvo.write_text(montar_partes(passo["partes"], final, onde), encoding="utf-8")
            elif acao == "inserir":
                novo = montar_partes(passo["partes"], final, onde)
                if passo.get("no_fim"):
                    alvo.write_text(atual + novo, encoding="utf-8")
                else:
                    ancora = passo["depois"]
                    if atual.count(ancora) != 1:
                        raise RoteiroErrado(f"{onde}: a âncora aparece {atual.count(ancora)} vezes em {passo['arquivo']}: {ancora!r}")
                    alvo.write_text(atual.replace(ancora, ancora + novo), encoding="utf-8")
            elif acao == "trocar":
                de = passo["de"]
                if atual.count(de) != 1:
                    raise RoteiroErrado(f"{onde}: o trecho a trocar aparece {atual.count(de)} vezes em {passo['arquivo']}: {de!r}")
                alvo.write_text(atual.replace(de, montar_partes(passo["para"], final, onde)), encoding="utf-8")
            else:
                raise RoteiroErrado(f"{onde}: ação desconhecida")
        feito, real = arquivos(pasta), arquivos(projeto)
        diferentes = sorted(set(feito) ^ set(real)) + [k for k in feito if k in real and feito[k] != real[k]]
        if diferentes:
            raise RoteiroErrado(f"{roteiro.name}: no fim, a pasta não é igual ao projeto real: {', '.join(diferentes)}")
    return saidas


def rodar(livro: str) -> dict:
    base = RAIZ / "livros" / livro
    conf = json.loads((base / "comandos.json").read_text(encoding="utf-8"))
    projeto = base / "projeto"
    subprocess.run(["uv", "sync", "--quiet"], cwd=projeto, check=True)
    saidas = {}
    for chave, c in conf["comandos"].items():
        codigo, linhas = executar(c["comando"], projeto, conf["pasta_do_leitor"])
        saidas[chave] = {"comando": c["comando"], "saiu_com": codigo, "saida": linhas}
        esperado = c.get("saiu_com", 0)
        if codigo != esperado:
            print(f"aviso: {chave} saiu com {codigo}, o esperado era {esperado}", file=sys.stderr)
    for roteiro in sorted((base / "roteiros").glob("*.json")):
        do_roteiro = construir(livro, roteiro, conf["pasta_do_leitor"])
        if repetidas := set(do_roteiro) & set(saidas):
            raise RoteiroErrado(f"{roteiro.name}: ids que já existem: {', '.join(sorted(repetidas))}")
        saidas.update(do_roteiro)
    return saidas


def sem_tempo(saidas: dict) -> dict:
    return {k: {**v, "saida": [[ENDERECO.sub("at 0x…", TEMPO.sub("in …s", l)), c] for l, c in v["saida"]]} for k, v in saidas.items()}


def principal(argv: list[str]) -> int:
    if not argv or argv[0].startswith("-"):
        print(__doc__, file=sys.stderr)
        return 2
    livro, conferir = argv[0], "--conferir" in argv
    arquivo = RAIZ / "livros" / livro / "saidas.json"
    try:
        novas = rodar(livro)
    except RoteiroErrado as erro:
        print(f"roteiro: {erro}", file=sys.stderr)
        return 1
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
