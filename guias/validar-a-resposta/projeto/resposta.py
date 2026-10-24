"""Confere a resposta do modelo antes de agir."""
import sys
from typing import Literal

from pydantic import BaseModel, ValidationError


class Decisao(BaseModel):
    acao: Literal["responder", "abrir_chamado", "recusar", "passar"]
    pedido: str | None = None
    motivo: str


def ler(texto: str) -> Decisao:
    return Decisao.model_validate_json(texto)


if __name__ == "__main__":
    texto = open(sys.argv[1], encoding="utf-8").read()
    try:
        print(ler(texto))
    except ValidationError as erro:
        print(erro)
        sys.exit(1)
