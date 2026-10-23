"""A ferramenta: a temperatura atual de uma cidade, pelo Open-Meteo (não precisa de chave)."""
import httpx
from langchain.tools import tool

ACHAR_CIDADE = "https://geocoding-api.open-meteo.com/v1/search"
PREVISAO = "https://api.open-meteo.com/v1/forecast"


def coordenadas(cidade: str) -> tuple[float, float, str] | None:
    """Latitude, longitude e nome oficial da cidade; None se não achar."""
    r = httpx.get(ACHAR_CIDADE, params={"name": cidade, "count": 1, "language": "pt"}, timeout=10)
    r.raise_for_status()
    achados = r.json().get("results")
    if not achados:
        return None
    c = achados[0]
    return c["latitude"], c["longitude"], f"{c['name']}, {c.get('country', '')}"


@tool
def temperatura_agora(cidade: str) -> str:
    """Temperatura atual de uma cidade, em graus Celsius.

    Args:
        cidade: o nome da cidade, como o usuário escreveu (ex.: "Recife").
    """
    lugar = coordenadas(cidade)
    if lugar is None:
        return f"Não achei a cidade {cidade!r}."
    lat, lon, nome = lugar
    r = httpx.get(PREVISAO, params={"latitude": lat, "longitude": lon, "current": "temperature_2m"}, timeout=10)
    r.raise_for_status()
    graus = r.json()["current"]["temperature_2m"]
    return f"{nome}: {graus} °C agora."
