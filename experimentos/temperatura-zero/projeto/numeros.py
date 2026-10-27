"""Arredondamento explícito em binary16; as pontuações são construídas."""
import struct


def fp16(valor):
    return struct.unpack("e", struct.pack("e", valor))[0]


def somas(pequeno=0.4):
    a, b = fp16(1024), fp16(pequeno)
    esquerda = fp16(fp16(a + b) + b)
    direita = fp16(a + fp16(b + b))
    return esquerda, direita


def escolher(pontuacoes):
    return max(range(len(pontuacoes)), key=pontuacoes.__getitem__)


def escolhas(margem=0.5):
    return [escolher([soma - 1024, margem]) for soma in somas()]


if __name__ == "__main__":
    print("Arredondamento binary16; pontuações construídas, não logits de LLM.")
    print("duas ordens:", somas())
    print("com inteiros:", somas(1))
    print("escolhas A=0, B=1:", escolhas())
