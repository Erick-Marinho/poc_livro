"""A gravação do modelo (scripts/gravacao): grava uma vez, repete sem chamar, e recusa a chamada que não foi gravada.

Roda com o Python do projeto, que tem o LangChain: npm test chama isto. Nenhum modelo de verdade é chamado: o
"modelo de mentira" daqui conta quantas vezes foi chamado, e é isso que os testes conferem.
"""
import json
import os
import subprocess
import sys
from pathlib import Path

import pytest
from langchain_core.globals import set_llm_cache
from langchain_core.language_models import BaseChatModel
from langchain_core.language_models.fake_chat_models import GenericFakeChatModel
from langchain_core.messages import AIMessage
from langchain_core.outputs import ChatGeneration, ChatResult

PASTA = Path(__file__).resolve().parent.parent / "scripts" / "gravacao"
sys.path.insert(0, str(PASTA))
from gravacao import ChamadaNaoGravada, Gravacao  # noqa: E402


class ModeloDeMentira(BaseChatModel):
    """Faz o papel de um modelo de verdade: não é falso para a gravação, e conta as chamadas."""

    chamadas: int = 0

    @property
    def _llm_type(self) -> str:
        return "mentira-chat"

    def _generate(self, messages, stop=None, run_manager=None, **kwargs):
        self.chamadas += 1
        return ChatResult(generations=[ChatGeneration(message=AIMessage(content=f"resposta {self.chamadas}"))])


@pytest.fixture(autouse=True)
def sem_cache():
    yield
    set_llm_cache(None)


def test_grava_e_depois_repete_sem_chamar(tmp_path):
    arquivo = tmp_path / "r02-teste.json"
    g = Gravacao(arquivo, "gravar")
    set_llm_cache(g)
    modelo = ModeloDeMentira()
    assert modelo.invoke("Cadê o BT-1002?").text == "resposta 1"
    g.salvar()
    assert arquivo.exists()

    set_llm_cache(Gravacao(arquivo, "repetir"))
    outro = ModeloDeMentira()
    assert outro.invoke("Cadê o BT-1002?").text == "resposta 1"
    assert outro.chamadas == 0


def test_recusa_a_chamada_que_nao_foi_gravada(tmp_path):
    set_llm_cache(Gravacao(tmp_path / "vazia.json", "repetir"))
    modelo = ModeloDeMentira()
    with pytest.raises(ChamadaNaoGravada, match="não está em vazia.json"):
        modelo.invoke("Uma pergunta que ninguém gravou")
    assert modelo.chamadas == 0


def test_gravar_de_novo_tira_o_que_ninguem_usa_mais(tmp_path):
    arquivo = tmp_path / "r02-teste.json"
    g = Gravacao(arquivo, "gravar")
    set_llm_cache(g)
    ModeloDeMentira().invoke("pergunta velha")
    g.salvar()
    g = Gravacao(arquivo, "gravar")
    set_llm_cache(g)
    ModeloDeMentira().invoke("pergunta nova")
    g.salvar()
    gravadas = json.loads(arquivo.read_text(encoding="utf-8")).values()
    assert [i["mensagens"][-1]["kwargs"]["content"] for i in gravadas] == ["pergunta nova"]


def test_modelo_falso_dos_testes_passa_direto(tmp_path):
    set_llm_cache(Gravacao(tmp_path / "vazia.json", "repetir"))
    falso = GenericFakeChatModel(messages=iter([AIMessage(content="combinado")]))
    assert falso.invoke("qualquer coisa").text == "combinado"


def test_o_sitecustomize_liga_a_gravacao_em_qualquer_python(tmp_path):
    """O que o gravador do livro faz em cada comando: PYTHONPATH com a pasta, e LIVRO_GRAVACAO com o arquivo."""
    codigo = (f"import sys; sys.path.insert(0, {str(Path(__file__).parent)!r}); "
              "from test_gravacao import ModeloDeMentira; m = ModeloDeMentira(); print(m.invoke('oi').text, m.chamadas)")
    env = {**os.environ, "PYTHONPATH": str(PASTA), "LIVRO_GRAVACAO": str(tmp_path / "cmd.json")}
    repetir = subprocess.run([sys.executable, "-c", codigo], env=env, capture_output=True, text=True)
    assert repetir.returncode != 0 and "ChamadaNaoGravada" in repetir.stderr
    gravar = subprocess.run([sys.executable, "-c", codigo], env={**env, "LIVRO_GRAVACAO_MODO": "gravar"}, capture_output=True, text=True)
    assert gravar.stdout.strip() == "resposta 1 1" and (tmp_path / "cmd.json").exists()
    de_novo = subprocess.run([sys.executable, "-c", codigo], env=env, capture_output=True, text=True)
    assert de_novo.returncode == 0 and de_novo.stdout.strip() == "resposta 1 0"   # a mesma resposta, sem chamar
