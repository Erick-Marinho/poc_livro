"""Liga a gravação do modelo (gravacao.py) em todo Python que o livro roda, quando LIVRO_GRAVACAO está definido.

O gravador do livro (scripts/saidas.py) põe esta pasta no PYTHONPATH de cada comando. Num projeto que ainda não tem
o LangChain (o capítulo 1), não há modelo para gravar, e nada acontece.
"""
import os

if os.environ.get("LIVRO_GRAVACAO"):
    try:
        import langchain_core  # noqa: F401
    except ImportError:
        pass
    else:
        from gravacao import ligar

        ligar()
