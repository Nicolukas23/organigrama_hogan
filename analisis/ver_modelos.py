"""
Ejecuta este script para ver qué modelos Gemini tienes disponibles.
Uso: python3 ver_modelos.py
"""
import sys

try:
    from google import genai
except ImportError:
    print("❌ Instala google-genai: pip3 install google-genai")
    sys.exit(1)

api_key = input("Pega tu API Key de Google AI Studio: ").strip()

try:
    cliente = genai.Client(api_key=api_key)
    print("\n✅ Conexión exitosa. Modelos disponibles:\n")

    modelos_flash = []
    todos = []

    for modelo in cliente.models.list():
        nombre = modelo.name
        todos.append(nombre)
        if "flash" in nombre.lower() or "pro" in nombre.lower():
            modelos_flash.append(nombre)
            print(f"  ✦ {nombre}")

    if not modelos_flash:
        print("  (sin resultados con flash/pro, mostrando todos:)")
        for m in todos:
            print(f"  · {m}")

    print(f"\nTotal: {len(todos)} modelos disponibles.")
    print("\n👉 Copia uno de esos nombres y úsalo como MODELO en analizador_hv.py")

except Exception as e:
    print(f"\n❌ Error: {e}")
    print("\nPosibles causas:")
    print("  · API Key incorrecta")
    print("  · La API de Gemini no está activada en tu proyecto")
    print("  · Ve a: https://console.cloud.google.com/apis/library/generativelanguage.googleapis.com")
