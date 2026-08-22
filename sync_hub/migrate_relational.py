"""
migrate_relational.py — Migra y puebla las tablas relacionales en Supabase
Transfiere datos de ninebox y tableros_json (hogan) hacia evaluaciones_ninebox y evaluaciones_hogan.
"""
import os
import json
from dotenv import load_dotenv
from supabase import create_client

load_dotenv('/Users/nicolassantos/Desktop/Proyectos/sync_hub/.env')

supabase_url = os.getenv("SUPABASE_URL")
supabase_key = os.getenv("SUPABASE_SERVICE_KEY")

if not supabase_url or not supabase_key:
    print("❌ Error: Faltan credenciales de Supabase en .env")
    exit(1)

client = create_client(supabase_url, supabase_key)

def migrate_hogan():
    print("📡 Migrando evaluaciones_hogan desde tableros_json...")
    try:
        res = client.table("tableros_json").select("data").eq("clave", "hogan").execute()
        if not res.data or not res.data[0].get("data"):
            print("⚠️ No se encontró el blob 'hogan' en tableros_json.")
            return

        h_data = res.data[0]["data"]
        rows_to_insert = []

        for group_type, groups in [('est', h_data.get('est', [])), ('op', h_data.get('op', []))]:
            for grp in groups:
                jefe = grp.get('dir', '')
                for m in grp.get('team', []):
                    rows_to_insert.append({
                        "nombre": m.get("name", "").strip(),
                        "jefe": jefe,
                        "cargo": m.get("cargo", ""),
                        "dir_area": m.get("dir_area", ""),
                        "gerencia": m.get("gerencia", ""),
                        "tipo_area": group_type,
                        "potencial": m.get("scores", {}).get("Potencial") if isinstance(m.get("scores"), dict) else None,
                        "versatilidad": m.get("versatilidad", ""),
                        "clasificacion": m.get("clasificacion", ""),
                        "scores": m.get("scores", {})
                    })

        if rows_to_insert:
            print(f"📦 Insertando {len(rows_to_insert)} registros en 'evaluaciones_hogan'...")
            # Insert in chunks of 100
            for i in range(0, len(rows_to_insert), 100):
                chunk = rows_to_insert[i:i+100]
                client.table("evaluaciones_hogan").upsert(chunk).execute()
            print("✅ 'evaluaciones_hogan' migrada exitosamente!")
    except Exception as e:
        print("❌ Error migrando hogan:", e)

def migrate_ninebox():
    print("📡 Migrando evaluaciones_ninebox desde ninebox...")
    try:
        res = client.table("ninebox").select("*").execute()
        if not res.data:
            print("⚠️ No hay registros en 'ninebox'.")
            return

        rows_to_insert = []
        for r in res.data:
            rows_to_insert.append({
                "expediente": str(r.get("expediente", "")).strip(),
                "periodo": "2026-H1",
                "caja": int(r.get("caja")) if r.get("caja") is not None else None,
                "desempeno": str(r.get("desempeno", "")),
                "potencial": str(r.get("potencial", "")),
                "sucesor": str(r.get("sucesor", "No")),
                "tiempo": str(r.get("tiempo", "")),
                "nivel_reporte": int(r.get("nivel_reporte")) if r.get("nivel_reporte") is not None else None,
                "bp": str(r.get("bp", ""))
            })

        if rows_to_insert:
            print(f"📦 Insertando {len(rows_to_insert)} registros en 'evaluaciones_ninebox'...")
            for i in range(0, len(rows_to_insert), 100):
                chunk = rows_to_insert[i:i+100]
                client.table("evaluaciones_ninebox").upsert(chunk).execute()
            print("✅ 'evaluaciones_ninebox' migrada exitosamente!")
    except Exception as e:
        print("❌ Error migrando ninebox:", e)

if __name__ == "__main__":
    print("=== MIGRACIÓN DE DATOS A MODELO RELACIONAL ===")
    migrate_hogan()
    migrate_ninebox()
