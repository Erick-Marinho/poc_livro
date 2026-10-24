"""A gravação do que o modelo respondeu: o livro chama o modelo uma vez (paga, com o ok dos autores) e repete no build.

É o cache de modelos da LangChain (`set_llm_cache`) trocado por um que lê e grava um arquivo. Toda chamada a um
modelo de chat passa por ele antes de ir para a rede, com uma chave feita das mensagens e dos parâmetros do modelo;
o código do leitor não muda. O `sitecustomize.py` desta pasta liga a gravação quando LIVRO_GRAVACAO aponta um arquivo:

    LIVRO_GRAVACAO_MODO=repetir  (o padrão) toda chamada tem que estar gravada; a que não está para o comando
    LIVRO_GRAVACAO_MODO=gravar   chama o modelo de verdade no que falta, e grava no fim só o que foi usado

Modelos falsos (os dos testes, que já devolvem sempre o mesmo) passam direto, sem gravar nada.
"""
import atexit
import hashlib
import json
import os
import warnings
from datetime import date
from pathlib import Path

from langchain_core.caches import BaseCache
from langchain_core.globals import set_llm_cache
from langchain_core.load import dumpd, load


class ChamadaNaoGravada(RuntimeError):
    """O código pediu ao modelo algo que não está na gravação: o livro mostraria uma resposta que ninguém viu."""


class Gravacao(BaseCache):
    def __init__(self, arquivo: Path, modo: str = "repetir"):
        if modo not in ("repetir", "gravar"):
            raise ValueError(f"LIVRO_GRAVACAO_MODO={modo}: use repetir ou gravar")
        self.arquivo, self.modo = Path(arquivo), modo
        self.itens = json.loads(self.arquivo.read_text(encoding="utf-8")) if self.arquivo.exists() else {}
        self.usadas: dict[str, dict] = {}

    @staticmethod
    def chave(prompt: str, llm_string: str) -> str:
        return hashlib.sha256(f"{llm_string}\n{prompt}".encode()).hexdigest()[:16]

    @staticmethod
    def falso(llm_string: str) -> bool:
        return "fake" in llm_string.lower()

    def lookup(self, prompt: str, llm_string: str):
        if self.falso(llm_string):
            return None
        k = self.chave(prompt, llm_string)
        if k in self.itens:
            self.usadas[k] = self.itens[k]
            # o aviso de "beta" do load é da gravação, não do código do leitor: não pode aparecer no terminal do livro
            with warnings.catch_warnings():
                warnings.simplefilter("ignore")
                return [load(g) for g in self.itens[k]["resposta"]]
        if self.modo == "gravar":
            return None
        raise ChamadaNaoGravada(
            f"o código pediu ao modelo uma resposta que não está em {self.arquivo.name}. "
            "O livro só mostra o que o modelo respondeu de verdade: grave de novo (npm run gravar, chamada paga).")

    def update(self, prompt: str, llm_string: str, return_val) -> None:
        if self.modo != "gravar" or self.falso(llm_string):
            return
        self.usadas[self.chave(prompt, llm_string)] = {
            "quando": date.today().isoformat(), "modelo": llm_string, "mensagens": json.loads(prompt),
            "resposta": [dumpd(g) for g in return_val]}

    def clear(self, **kwargs) -> None:
        self.itens, self.usadas = {}, {}

    def salvar(self) -> None:
        """No modo gravar, o arquivo fica só com o que este comando usou: resposta velha que ninguém pede mais sai."""
        if self.modo != "gravar":
            return
        if not self.usadas:
            self.arquivo.unlink(missing_ok=True)
            return
        self.arquivo.parent.mkdir(parents=True, exist_ok=True)
        self.arquivo.write_text(json.dumps(dict(sorted(self.usadas.items())), ensure_ascii=False, indent=1) + "\n",
                                encoding="utf-8")


def ligar() -> Gravacao | None:
    """Liga a gravação se LIVRO_GRAVACAO apontar um arquivo (chamado pelo sitecustomize.py)."""
    arquivo = os.environ.get("LIVRO_GRAVACAO")
    if not arquivo:
        return None
    g = Gravacao(Path(arquivo), os.environ.get("LIVRO_GRAVACAO_MODO", "repetir"))
    set_llm_cache(g)
    atexit.register(g.salvar)
    return g
