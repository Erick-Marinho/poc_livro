"""O contrato do agente: o que ele faz com cada pergunta, escrito antes de existir agente."""
import json
from enum import StrEnum
from pathlib import Path

from pydantic import BaseModel, Field, model_validator

AQUI = Path(__file__).parent
DADOS = AQUI / "dados"


class Decisao(StrEnum):
    """As quatro saídas possíveis do agente para uma pergunta."""

    RESPONDER = "responder"           # responde com o que está nos dados ou na política
    ABRIR_CHAMADO = "abrir_chamado"   # abre um chamado de troca ou de defeito
    RECUSAR = "recusar"               # diz que não pode, e por quê
    PASSAR = "passar"                 # passa a vez para uma pessoa da equipe


class Fonte(StrEnum):
    """Onde está a informação de que o agente precisa."""

    PEDIDOS = "pedidos"
    POLITICA = "politica"
    CATALOGO = "catalogo"


class Caso(BaseModel):
    """Uma pergunta de referência e a decisão que o contrato espera para ela."""

    id: str = Field(pattern=r"^R\d{2}$")
    pergunta: str = Field(min_length=5)
    decisao: Decisao
    motivo: str = Field(min_length=5, description="por que o contrato decide assim, em uma frase")
    precisa: list[Fonte] = []
    pedido: str | None = Field(default=None, pattern=r"^BT-\d{4}$")
    email: str | None = None

    @model_validator(mode="after")
    def pedido_vem_com_email(self):
        if (self.pedido is None) != (self.email is None):
            raise ValueError("pedido e e-mail andam juntos: informe os dois ou nenhum")
        if Fonte.PEDIDOS in self.precisa and self.pedido is None:
            raise ValueError("um caso que precisa dos pedidos tem que dizer qual pedido")
        return self


def carregar_referencia(caminho: Path = AQUI / "referencia.jsonl") -> list[Caso]:
    """As perguntas de referência, uma por linha; para na primeira linha inválida, dizendo qual."""
    casos = []
    for n, linha in enumerate(caminho.read_text(encoding="utf-8").splitlines(), start=1):
        if not linha.strip():
            continue
        try:
            casos.append(Caso.model_validate_json(linha))
        except ValueError as erro:
            raise ValueError(f"{caminho.name}, linha {n}: {erro}") from erro
    return casos


def carregar(nome: str):
    """Um arquivo de dados da loja inventada."""
    return json.loads((DADOS / f"{nome}.json").read_text(encoding="utf-8"))
