"""Roda os comandos de um livro no projeto real e grava o que o terminal mostrou.

    python3 scripts/saidas.py <livro>              grava livros/<livro>/saidas.json
    python3 scripts/saidas.py <livro> --conferir   roda de novo e falha se a saída mudou
    python3 scripts/saidas.py <livro> --leitor DIR  grava, e gera em DIR o repositório do leitor (uma tag por passo)

Os comandos ficam em livros/<livro>/comandos.json. Cada um roda dentro de livros/<livro>/projeto (ou da pasta
em "em", como marcos/cap-01 para um comando do capítulo 1), depois de um `uv sync`. O caminho da máquina vira o caminho do leitor, e os tempos (como
"in 0.63s") e os endereços de memória (como "at 0x7f3a…") não contam na conferência. Saída 0: tudo certo. 1: alguma saída mudou. 2: uso errado.

Todo comando roda com a gravação do modelo ligada (scripts/gravacao): o que um modelo de verdade responde fica em
livros/<livro>/gravacoes/<id>.json e é repetido; chamada que não está gravada para o comando. Para gravar (chamada
paga, só com o ok dos autores e a chave no ambiente): LIVRO_GRAVACAO_MODO=gravar, ou npm run gravar.

Os roteiros de construção (livros/<livro>/roteiros/*.json) contam o caminho do código na ordem em que se
pensa, com os erros do caminho. Cada um é aplicado numa pasta vazia: copiar, escrever, inserir, trocar, apagar e
rodar (com `"onde": "acima"`, o comando roda na pasta de cima, como o `uv init`). Cada `rodar` grava a saída no estado em que o código está naquele passo.

Os roteiros se encadeiam: o 01 parte da pasta vazia, e cada um dos seguintes parte de onde o anterior terminou.
No fim, a pasta do roteiro NN tem que ser igual a marcos/cap-NN/ (o projeto congelado no fim do capítulo NN) ou,
enquanto o capítulo não fechou, ao projeto/. E o projeto/ tem que ser igual ao fim do último roteiro: nada no
projeto real fica sem um roteiro que o construa. Um roteiro que não chega ao projeto real não monta o livro.
"""
import difflib
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

RAIZ = Path(__file__).resolve().parent.parent
RUIDO = re.compile(r"^warning: The `UV_\w+` environment variable is deprecated")   # aviso do ambiente, não do projeto
TEMPO = re.compile(r"\bin \d+(\.\d+)?m?s\b")
# linhas do uv que dependem do que a máquina já tem (o Python instalado, o que já foi baixado): gravadas como saíram,
# mas fora da conferência, para o livro não falhar só porque o cache de quem roda é outro
VARIA = re.compile(r"^(Using CPython |Creating virtual environment at: |Downloading |\s*Downloaded |Prepared \d+ packages? in )")
ENDERECO = re.compile(r"\bat 0x[0-9a-f]+\b")   # endereço de memória que o Python imprime: muda a cada execução


def classe(linha: str) -> str:
    if re.search(r"\b\d+ passed\b", linha) and not re.search(r"\b(failed|error)\b", linha):
        return "okv"
    if re.match(r"^(FAILED|ERROR|E  |Traceback|([\w.]+\.)?\w*Error\b)|\b\d+ (failed|errors?)\b", linha):
        return "err"
    return ""


def executar(comando: str, pasta: Path, leitor: str, env: dict | None = None, cwd: Path | None = None) -> tuple[int, list]:
    r = subprocess.run(["bash", "-c", comando], cwd=cwd or pasta, capture_output=True, text=True, env=env)
    # o caminho da máquina vira o do leitor: a pasta do projeto, e a pasta de cima dela (onde o `uv init` roda)
    texto = (r.stdout + r.stderr).replace(str(pasta), leitor).replace(str(pasta.parent), str(Path(leitor).parent))
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
    fora = {".venv", "__pycache__", ".pytest_cache", ".ruff_cache", ".git"}
    return {str(p.relative_to(pasta)): p.read_bytes() for p in sorted(pasta.rglob("*"))
            if p.is_file() and not fora & set(p.relative_to(pasta).parts)}


def alteradas(antes: str, depois: str) -> list[int]:
    """As linhas (contadas a partir de 1, no texto novo) que entraram ou mudaram."""
    novas = []
    for op, _, _, j1, j2 in difflib.SequenceMatcher(a=antes.splitlines(), b=depois.splitlines(), autojunk=False).get_opcodes():
        if op in ("replace", "insert"):
            novas.extend(range(j1 + 1, j2 + 1))
    return novas


def com_gravacao(env: dict, livro: str, id_: str) -> dict:
    """O ambiente de um comando com a gravação do modelo ligada: o sitecustomize da gravação entra no PYTHONPATH."""
    pasta = str(RAIZ / "scripts" / "gravacao")
    modo = os.environ.get("LIVRO_GRAVACAO_MODO", "repetir")
    novo = {**env, "PYTHONPATH": os.pathsep.join(p for p in (pasta, env.get("PYTHONPATH")) if p),
            "LIVRO_GRAVACAO": str(RAIZ / "livros" / livro / "gravacoes" / f"{id_}.json"), "LIVRO_GRAVACAO_MODO": modo}
    # o cliente da OpenAI exige uma chave já ao ser criado; repetindo, a chave é de mentira e nunca sai da máquina:
    # a gravação recusa, antes da rede, qualquer chamada que não esteja gravada
    if modo == "repetir":
        novo["OPENAI_API_KEY"] = "sk-livro-repete-a-gravacao-sem-chamar"
    return novo


def ambiente(versoes_ate: str | None) -> dict:
    """`versoes_ate`: o uv só enxerga versões publicadas até essa data, e o `uv add` dá sempre o mesmo resultado.
    Vale também para o `uv sync` do projeto/, senão ele reescreve o uv.lock sem a data."""
    # UV_LINK_MODE=copy: a pasta do roteiro fica em /tmp, muitas vezes noutro disco que o cache do uv, e o aviso de
    # "Failed to hardlink" entraria na saída de quem grava; o leitor, na pasta dele, não vê esse aviso
    return {**os.environ, "UV_LINK_MODE": "copy", **({"UV_EXCLUDE_NEWER": versoes_ate} if versoes_ate else {})}


IGNORAR = shutil.ignore_patterns(".venv", "__pycache__", ".pytest_cache", ".ruff_cache")


def fim_do_capitulo(livro: str, roteiro: Path) -> Path:
    """Onde o roteiro NN tem que chegar: o marco do capítulo, se ele já fechou; senão, o projeto/."""
    marco = RAIZ / "livros" / livro / "marcos" / f"cap-{roteiro.stem}"
    return marco if marco.is_dir() else RAIZ / "livros" / livro / "projeto"


def construir(livro: str, roteiro: Path, leitor: str, trabalho: Path, inicio: Path | None = None,
              versoes_ate: str | None = None, repositorio: bool = False) -> tuple[dict, list, Path]:
    """Aplica um roteiro em `trabalho`: numa pasta vazia, ou numa cópia de `inicio` (onde o roteiro anterior terminou).
    Devolve a saída de cada `rodar`, o estado do código depois de cada passo e a pasta em que o roteiro terminou.
    Com `repositorio`: no fim de cada passo do capítulo (livros/<livro>/passos/<n>.json), faz um commit e uma tag na
    pasta (que é um repositório git desde o `uv init`); marca também o início (a partir do 2) e o fim do capítulo."""
    projeto = fim_do_capitulo(livro, roteiro)
    dados_roteiro = json.loads(roteiro.read_text(encoding="utf-8"))
    passos = dados_roteiro["passos"]
    saidas, estados = {}, []
    env = ambiente(dados_roteiro.get("versoes_ate", versoes_ate))
    marcos, num = {}, roteiro.stem
    # um capítulo ainda sem passos (livros/<livro>/passos/<n>.json) está em construção: roda, mas não entra no
    # repositório do leitor, que fica no fim do último capítulo com passos
    passos_cap = RAIZ / "livros" / livro / "passos" / roteiro.name
    repositorio = repositorio and passos_cap.exists()
    if repositorio:
        cap = json.loads(passos_cap.read_text(encoding="utf-8"))
        marcos = {p["ate"]: (f"cap-{num}/passo-{i:02d}", f"capítulo {int(num)}, passo {i}: {p['titulo']}") for i, p in enumerate(cap["passos"], start=1)}
    pasta = trabalho / Path(leitor).name   # só passa a existir quando o roteiro cria (o `uv init`, ou o primeiro arquivo)
    if inicio:
        shutil.copytree(inicio, pasta, ignore=IGNORAR, symlinks=True)
        # o leitor chega com o .venv do capítulo anterior pronto: refazer em silêncio, senão o primeiro `uv run` do
        # capítulo mostraria "Creating virtual environment", que o leitor não vê
        if (pasta / "pyproject.toml").exists():
            subprocess.run(["uv", "sync", "--quiet"], cwd=pasta, check=True, env=env)
        if repositorio:
            etiquetar(pasta, f"cap-{num}/inicio", f"capítulo {int(num)}: o ponto de partida", int(num), 0)
    for n, passo in enumerate(passos, start=1):
        if n - 1 in marcos:
            marcar(pasta, *marcos[n - 1], int(num), n - 1)
        onde, acao = f"{roteiro.name}, passo {n} ({passo['acao']})", passo["acao"]
        if acao == "copiar":
            pasta.mkdir(exist_ok=True)
            for nome in passo["arquivos"]:
                (pasta / nome).parent.mkdir(parents=True, exist_ok=True)
                shutil.copyfile(projeto / nome, pasta / nome)
            # arquivo grande copiado (o uv.lock) entra só pelo nome: a IDE mostra na árvore, não abre
            estados.append({"passo": n, "arquivos": {nome: (texto if len(texto := (pasta / nome).read_text(encoding="utf-8")) < 16000 else None)
                                                    for nome in passo["arquivos"]}})
            continue
        if acao == "rodar":
            cwd = pasta.parent if passo.get("onde") == "acima" else pasta
            # comando do uv cuida do ambiente sozinho, e o leitor vê ele nascer; os outros precisam do ambiente pronto
            if cwd == pasta and not passo["comando"].startswith("uv ") and (pasta / "pyproject.toml").exists() and not (pasta / ".venv").exists():
                subprocess.run(["uv", "sync", "--quiet"], cwd=pasta, check=True, env=env)
            antes_de_rodar = arquivos(pasta) if pasta.exists() else {}
            codigo, linhas = executar(passo["comando"], pasta, leitor, com_gravacao(env, livro, passo["id"]), cwd)
            if codigo != passo.get("espera", 0):
                raise RoteiroErrado(f"{onde}: {passo['id']} saiu com {codigo}, o roteiro espera {passo.get('espera', 0)}\n"
                                    + "\n".join(f"    {l}" for l, _ in linhas))
            saidas[passo["id"]] = {"comando": passo["comando"], "saiu_com": codigo, "saida": linhas}
            # o que o comando criou ou mudou no projeto (o `uv init`, o `uv add`): a página mostra como qualquer edição
            depois_de_rodar = arquivos(pasta) if pasta.exists() else {}
            gerados = {k: (v.decode("utf-8") if len(v) < 16000 else None) for k, v in depois_de_rodar.items() if antes_de_rodar.get(k) != v}
            estado = {"passo": n, "rodou": passo["id"]}
            if gerados:
                estado["gerados"] = gerados
            if apagados := sorted(set(antes_de_rodar) - set(depois_de_rodar)):
                estado["apagados"] = apagados
            estados.append(estado)
            continue
        if acao == "apagar":
            alvo = pasta / passo["arquivo"]
            if not alvo.exists():
                raise RoteiroErrado(f"{onde}: {passo['arquivo']} não existe para apagar")
            alvo.unlink()
            estados.append({"passo": n, "apagado": passo["arquivo"]})
            continue
        pasta.mkdir(exist_ok=True)
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
        depois = alvo.read_text(encoding="utf-8")
        estados.append({"passo": n, "arquivo": passo["arquivo"], "conteudo": depois, "alteradas": alteradas(atual, depois)})
    if len(passos) in marcos:
        marcar(pasta, *marcos[len(passos)], int(num), len(passos))
    if repositorio:
        etiquetar(pasta, f"cap-{num}/fim", f"capítulo {int(num)}: o fim", int(num), len(passos))
    diferentes = diferenca(pasta, projeto)
    if diferentes:
        raise RoteiroErrado(f"{roteiro.name}: no fim, a pasta não é igual a {projeto.relative_to(RAIZ)}: {', '.join(diferentes)}")
    return saidas, estados, pasta


def diferenca(a: Path, b: Path) -> list[str]:
    """Os arquivos que faltam de um lado ou que mudaram, entre duas pastas do projeto."""
    feito, real = arquivos(a), arquivos(b)
    return sorted(set(feito) ^ set(real)) + [k for k in feito if k in real and feito[k] != real[k]]


GIT_LIVRO = {"GIT_AUTHOR_NAME": "O ciclo de vida de um agente", "GIT_AUTHOR_EMAIL": "livro@fontmar.invalid",
             "GIT_COMMITTER_NAME": "O ciclo de vida de um agente", "GIT_COMMITTER_EMAIL": "livro@fontmar.invalid"}


def _git(pasta: Path, tag: str, cap: int, n: int):
    """O git do repositório do leitor, com data fixa: uma hora por capítulo (o 1 às 12h) e um minuto por passo, para o
    repositório sair igual toda vez que for gerado."""
    if not (pasta / ".git").exists():
        raise RoteiroErrado(f"{tag}: a pasta ainda não é um repositório git (o `uv init` cria um)")
    quando = f"2026-10-16T{11 + cap:02d}:{n % 60:02d}:00Z"
    env = {**os.environ, **GIT_LIVRO, "GIT_AUTHOR_DATE": quando, "GIT_COMMITTER_DATE": quando}
    # sem assinatura: a máquina de quem gera pode assinar commits sozinha, e aí o repositório sairia diferente em cada uma
    return lambda *a: subprocess.run(["git", "-C", str(pasta), "-c", "commit.gpgsign=false", "-c", "tag.gpgsign=false", *a],
                                     check=True, capture_output=True, text=True, env=env)


def marcar(pasta: Path, tag: str, mensagem: str, cap: int, n: int) -> None:
    """Um ponto de volta: commit de tudo o que o leitor tem até aqui (o .gitignore do uv deixa o .venv de fora) e a tag."""
    git = _git(pasta, tag, cap, n)
    git("checkout", "-q", "-B", "main")
    git("add", "-A")
    git("commit", "-q", "--allow-empty", "-m", mensagem)
    git("tag", "-a", tag, "-m", mensagem)


def etiquetar(pasta: Path, tag: str, mensagem: str, cap: int, n: int) -> None:
    """Uma tag no commit em que o projeto está, sem commit novo: o início e o fim de um capítulo."""
    _git(pasta, tag, cap, n)("tag", "-a", tag, "-m", mensagem)


def rodar(livro: str, repositorio: Path | None = None) -> tuple[dict, dict]:
    base = RAIZ / "livros" / livro
    conf = json.loads((base / "comandos.json").read_text(encoding="utf-8"))
    projeto = base / "projeto"
    env = ambiente(conf.get("versoes_ate"))
    saidas, sincronizadas = {}, set()
    for chave, c in conf["comandos"].items():
        onde = base / c.get("em", "projeto")
        if onde not in sincronizadas:
            subprocess.run(["uv", "sync", "--quiet"], cwd=onde, check=True, env=env)
            sincronizadas.add(onde)
        codigo, linhas = executar(c["comando"], onde, conf["pasta_do_leitor"], com_gravacao(env, livro, chave))
        saidas[chave] = {"comando": c["comando"], "saiu_com": codigo, "saida": linhas}
        esperado = c.get("saiu_com", 0)
        if codigo != esperado:
            print(f"aviso: {chave} saiu com {codigo}, o esperado era {esperado}", file=sys.stderr)
    estados = {}
    roteiros = sorted(p for p in (base / "roteiros").glob("*.json") if not p.name.endswith(".estados.json"))
    with tempfile.TemporaryDirectory(prefix="roteiros-") as tmp:
        fim = None
        for roteiro in roteiros:
            trabalho = Path(tmp) / roteiro.stem
            trabalho.mkdir()
            do_roteiro, estados[roteiro], fim = construir(livro, roteiro, conf["pasta_do_leitor"], trabalho, fim,
                                                          conf.get("versoes_ate"), repositorio is not None)
            if repetidas := set(do_roteiro) & set(saidas):
                raise RoteiroErrado(f"{roteiro.name}: ids que já existem: {', '.join(sorted(repetidas))}")
            saidas.update(do_roteiro)
        # o projeto real é o fim do último roteiro: nada nele fica sem um roteiro que o construa
        if fim and (diferentes := diferenca(fim, projeto)):
            raise RoteiroErrado(f"o projeto/ não é igual ao fim do último roteiro ({roteiros[-1].name}): {', '.join(diferentes)}")
        if repositorio and fim:
            esperadas = tags_esperadas(livro, roteiros)
            if repositorio.exists():
                shutil.rmtree(repositorio)
            subprocess.run(["git", "clone", "--quiet", str(fim), str(repositorio)], check=True)
            subprocess.run(["git", "-C", str(repositorio), "remote", "remove", "origin"], check=True)
            tags = set(subprocess.run(["git", "-C", str(repositorio), "tag", "--list"], check=True, capture_output=True, text=True).stdout.split())
            if tags != esperadas:
                raise RoteiroErrado(f"o repositório do leitor tem as tags erradas: sobram {sorted(tags - esperadas)}, faltam {sorted(esperadas - tags)}")
    return saidas, estados


def tags_esperadas(livro: str, roteiros: list[Path]) -> set[str]:
    """As tags que o livro promete: uma por passo, o fim de cada capítulo e o início de cada um a partir do 2."""
    tags = set()
    for i, roteiro in enumerate(roteiros):
        if not (arquivo := RAIZ / "livros" / livro / "passos" / roteiro.name).exists():
            continue
        cap = json.loads(arquivo.read_text(encoding="utf-8"))
        tags |= {f"cap-{roteiro.stem}/passo-{j:02d}" for j in range(1, len(cap["passos"]) + 1)} | {f"cap-{roteiro.stem}/fim"}
        if i:
            tags.add(f"cap-{roteiro.stem}/inicio")
    return tags


def sem_tempo(saidas: dict) -> dict:
    return {k: {**v, "saida": [[ENDERECO.sub("at 0x…", TEMPO.sub("in …s", l)), c] for l, c in v["saida"] if not VARIA.match(l)]}
            for k, v in saidas.items()}


def principal(argv: list[str]) -> int:
    if not argv or argv[0].startswith("-"):
        print(__doc__, file=sys.stderr)
        return 2
    livro, conferir = argv[0], "--conferir" in argv
    repositorio = Path(argv[argv.index("--leitor") + 1]).resolve() if "--leitor" in argv else None
    arquivo = RAIZ / "livros" / livro / "saidas.json"
    try:
        novas, estados = rodar(livro, repositorio)
    except RoteiroErrado as erro:
        print(f"roteiro: {erro}", file=sys.stderr)
        return 1
    # o estado do código depois de cada passo de cada roteiro: é o que a IDE do livro mostra
    gravar = {r.with_name(r.stem + ".estados.json"): json.dumps(e, ensure_ascii=False, indent=1) + "\n" for r, e in estados.items()}
    if not conferir:
        arquivo.write_text(json.dumps(novas, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
        for destino, texto in gravar.items():
            destino.write_text(texto, encoding="utf-8")
        print(f"gravadas {len(novas)} saídas em {arquivo.relative_to(RAIZ)} e {len(gravar)} roteiro(s) com os estados")
        return 0
    velhos = [d.name for d, texto in gravar.items() if not d.exists() or d.read_text(encoding="utf-8") != texto]
    if velhos:
        print(f"os estados gravados não batem com o roteiro: {', '.join(velhos)}; rode npm run saidas", file=sys.stderr)
        return 1
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
