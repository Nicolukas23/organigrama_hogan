"""
app.py — Sync Hub: App Streamlit para actualización de tableros.
Sube Excels, analiza cambios, sincroniza Supabase + Git.
"""
import os
import sys
import tempfile
from datetime import datetime
from pathlib import Path

import streamlit as st
import pandas as pd
from dotenv import load_dotenv

# Cargar .env del directorio sync_hub
load_dotenv(Path(__file__).parent / ".env")

# Agregar directorio actual al path para imports
sys.path.insert(0, str(Path(__file__).parent))

from sync_engine import (
    DiffResult,
    extract_personas,
    extract_formacion,
    extract_desempeno,
    extract_talentos,
    extract_objetivos,
    extract_360,
    extract_clima,
    extract_sucesores,
    get_client,
    fetch_current,
    fetch_current_flat,
    compute_diff,
    compute_diff_flat,
    upsert_rows,
    run_full_sync,
)
from git_ops import save_excel_to_repo, commit_and_push, generate_commit_msg, get_last_commits


# ── Config ──────────────────────────────────────────────
st.set_page_config(
    page_title="Sync Hub · Claro Colombia",
    page_icon="🔄",
    layout="wide",
    initial_sidebar_state="collapsed",
)

# ── Auth ────────────────────────────────────────────────
USERS = {
    "nicolas.santos@claro.com.co": "1234",
    "laura.amadop@claro.com.co": "1234",
}


def check_auth():
    if "authenticated" not in st.session_state:
        st.session_state.authenticated = False
    return st.session_state.authenticated


def login_screen():
    st.markdown("## 🔄 Sync Hub")
    st.markdown("### Inicio de sesión")
    with st.form("login"):
        email = st.text_input("Correo electrónico")
        password = st.text_input("Contraseña", type="password")
        submitted = st.form_submit_button("Ingresar")
        if submitted:
            if email in USERS and USERS[email] == password:
                st.session_state.authenticated = True
                st.session_state.user = email
                st.rerun()
            else:
                st.error("Correo o contraseña incorrectos")


# ── Sidebar ─────────────────────────────────────────────
def sidebar():
    with st.sidebar:
        st.markdown(f"**👤** {st.session_state.get('user', '')}")
        if st.button("Cerrar sesión"):
            st.session_state.authenticated = False
            st.rerun()
        st.divider()
        st.markdown("### 📋 Historial de syncs")
        try:
            client = get_client()
            resp = client.table("sync_log").select("*").order("fecha", desc=True).limit(10).execute()
            logs = resp.data or []
            if logs:
                for log in logs:
                    fecha = log.get("fecha", "")[:16]
                    cambios = log.get("total_cambios", 0)
                    estado = "✅" if log.get("estado") == "exito" else "❌"
                    st.caption(f"{estado} {fecha} — {cambios} cambios")
            else:
                st.caption("Sin syncs previos")
        except Exception:
            st.caption("Sin historial disponible")


# ── Diff visual ─────────────────────────────────────────
def render_diff_table(diff: DiffResult) -> pd.DataFrame:
    """Convierte un DiffResult a DataFrame para mostrar en st.dataframe."""
    rows = []
    for item in diff.added:
        rows.append({
            "Tipo": "🆕 Agregado",
            "Tabla": diff.table,
            "Expediente": item.get("expediente", ""),
            "Nombre": item.get("nombre", ""),
            "Campo": "—",
            "Antes": "—",
            "Después": "—",
        })
    for item in diff.removed:
        rows.append({
            "Tipo": "🗑️ Eliminado",
            "Tabla": diff.table,
            "Expediente": item.get("expediente", ""),
            "Nombre": item.get("nombre", ""),
            "Campo": "—",
            "Antes": "—",
            "Después": "—",
        })
    for item in diff.modified:
        for cambio in item.get("cambios", []):
            rows.append({
                "Tipo": "🔄 Modificado",
                "Tabla": diff.table,
                "Expediente": item.get("expediente", ""),
                "Nombre": item.get("nombre", ""),
                "Campo": cambio["campo"],
                "Antes": str(cambio["antes"])[:50],
                "Después": str(cambio["despues"])[:50],
            })
    return pd.DataFrame(rows)


def show_diff_summary(diffs: list[DiffResult]):
    """Muestra resumen del diff en cards."""
    total_added = sum(len(d.added) for d in diffs)
    total_removed = sum(len(d.removed) for d in diffs)
    total_modified = sum(len(d.modified) for d in diffs)
    total = total_added + total_removed + total_modified

    col1, col2, col3, col4 = st.columns(4)
    col1.metric("Total cambios", total)
    col2.metric("🆕 Nuevos", total_added)
    col3.metric("🗑️ Eliminados", total_removed)
    col4.metric("🔄 Modificados", total_modified)


# ── Main app ────────────────────────────────────────────
def main_app():
    sidebar()

    st.markdown("# 🔄 Sync Hub")
    st.markdown("#### Sube los Excels, analiza los cambios y sincroniza todo en un clic.")

    # ── Upload ──────────────────────────────────────────
    st.markdown("### 📁 Subir Archivos")
    col1, col2, col3 = st.columns(3)

    with col1:
        ficha1 = st.file_uploader(
            "Info Ficha Talento 1",
            type=["xlsx"],
            key="ficha1",
            help="Hoja INFORMACION, Formación&Experiencia, Desempeño",
        )
    with col2:
        ficha2 = st.file_uploader(
            "Info Ficha Talento 2",
            type=["xlsx"],
            key="ficha2",
            help="Hoja Desempeño, Talentos, Objetivo Desarrollo, 360, Clima",
        )
    with col3:
        ninebox = st.file_uploader(
            "PARTICIPANTES NINE BOX",
            type=["xlsx"],
            key="ninebox",
            help="Hoja observaciones",
        )

    # Planta (opcional)
    planta = st.file_uploader(
        "Planta_de_Personal (opcional)",
        type=["xlsx"],
        key="planta",
        help="Si no se sube, se usa el nombre del Ficha 1",
    )

    if not ficha1 or not ficha2 or not ninebox:
        st.info("⚠️ Sube los 3 archivos principales para continuar.")
        return

    # ── Guardar archivos temporalmente ──────────────────
    tmp_dir = tempfile.mkdtemp()
    ficha1_path = os.path.join(tmp_dir, ficha1.name)
    ficha2_path = os.path.join(tmp_dir, ficha2.name)
    ninebox_path = os.path.join(tmp_dir, ninebox.name)
    planta_path = os.path.join(tmp_dir, planta.name) if planta else None

    with open(ficha1_path, "wb") as f:
        f.write(ficha1.read())
    with open(ficha2_path, "wb") as f:
        f.write(ficha2.read())
    with open(ninebox_path, "wb") as f:
        f.write(ninebox.read())
    if planta:
        with open(planta_path, "wb") as f:
            f.write(planta.read())

    # ── Analizar cambios ────────────────────────────────
    st.markdown("### 🔍 Analizando cambios...")

    with st.spinner("Leyendo Excels y comparando con Supabase..."):
        try:
            report = run_full_sync(
                ficha1_path=ficha1_path,
                ficha2_path=ficha2_path,
                ninebox_path=ninebox_path,
                planta_path=planta_path,
                dry_run=True,  # Solo analizar, no sincronizar aún
            )

            # Ahora hacer fetch de Supabase y compute diffs reales
            client = get_client()

            # Extraer data de los Excels
            if planta_path:
                personas_new = extract_personas(ficha1_path, planta_path)
            else:
                personas_new = extract_personas(ficha1_path, ficha1_path)
            formacion_new = extract_formacion(ficha1_path)
            desempeno_new = extract_desempeno(ficha1_path, ficha2_path)
            talentos_new = extract_talentos(ficha2_path)
            objetivos_new = extract_objetivos(ficha2_path)
            tres60_new = extract_360(ficha2_path)
            clima_new = extract_clima(ficha2_path)
            sucesores_new = extract_sucesores(ninebox_path)

            # Fetch actual de Supabase y comparar
            diffs: list[DiffResult] = []

            tables_keyed = [
                ("personas", personas_new),
                ("formacion", formacion_new),
                ("desempeno", desempeno_new),
                ("talentos", talentos_new),
                ("objetivos", objetivos_new),
                ("sucesores", sucesores_new),
            ]
            for table, new_data in tables_keyed:
                old = fetch_current(client, table)
                diff = compute_diff(old, new_data, table)
                diffs.append(diff)

            tables_flat = [
                ("evaluacion_360", tres60_new),
                ("clima", clima_new),
            ]
            for table, new_data in tables_flat:
                old = fetch_current_flat(client, table)
                diff = compute_diff_flat(old, new_data, table)
                diffs.append(diff)

            report.diffs = diffs

        except Exception as e:
            st.error(f"Error al analizar: {e}")
            return

    # ── Mostrar resultados ──────────────────────────────
    if not report.has_changes:
        st.success("✅ Todo actualizado. No hay cambios detectados.")
        return

    st.markdown("### 📊 Resumen de Cambios")
    show_diff_summary(report.diffs)

    # ── Tabla detallada de cambios ──────────────────────
    st.markdown("### 📋 Detalle de Cambios")

    # Filtrar por tabla
    tablas_con_cambios = [d.table for d in report.diffs if d.has_changes]
    if tablas_con_cambios:
        selected_table = st.selectbox("Filtrar por tabla", ["Todas"] + tablas_con_cambios)

        for diff in report.diffs:
            if not diff.has_changes:
                continue
            if selected_table != "Todas" and diff.table != selected_table:
                continue

            with st.expander(f"**{diff.table}** — {diff.total_changes} cambios", expanded=True):
                df = render_diff_table(diff)
                st.dataframe(df, use_container_width=True, height=min(len(df) * 35 + 40, 400))

    # ── Botón de sincronización ─────────────────────────
    st.markdown("### 🚀 Sincronizar")
    st.warning("Esto aplicará los cambios a Supabase y hará commit+push a GitHub.")

    col1, col2 = st.columns([1, 3])
    with col1:
        do_push = st.checkbox("Push a GitHub", value=True)
    with col2:
        commit_msg = st.text_input(
            "Mensaje de commit",
            value=generate_commit_msg(report.summary()),
        )

    if st.button("🔄 Sincronizar Ahora", type="primary", use_container_width=True):
        progress = st.progress(0, text="Iniciando sync...")

        # 1. Sync a Supabase
        progress.progress(0.1, text="📡 Conectando a Supabase...")
        try:
            client = get_client()

            all_tables = [
                ("personas", personas_new, False),
                ("formacion", formacion_new, False),
                ("desempeno", desempeno_new, False),
                ("talentos", talentos_new, False),
                ("objetivos", objetivos_new, False),
                ("sucesores", sucesores_new, False),
            ]

            for i, (table, data, replace_all) in enumerate(all_tables):
                progress.progress(
                    0.1 + (i / len(all_tables)) * 0.5,
                    text=f"📡 Sync {table}...",
                )
                rows = list(data.values()) if isinstance(data, dict) else data
                upsert_rows(client, table, rows, replace_all=replace_all)

            # Tablas planas
            for i, (table, data) in enumerate([("evaluacion_360", tres60_new), ("clima", clima_new)]):
                progress.progress(
                    0.6 + (i / 2) * 0.2,
                    text=f"📡 Sync {table}...",
                )
                upsert_rows(client, table, data, replace_all=True)

            progress.progress(0.8, text="✅ Supabase actualizado")

        except Exception as e:
            st.error(f"Error en Supabase: {e}")
            progress.progress(1.0, text="❌ Error")
            return

        # 2. Guardar Excels en repo
        progress.progress(0.85, text="💾 Guardando Excels en repo...")
        saved_files = []
        for f in [ficha1, ficha2, ninebox, planta]:
            if f:
                saved = save_excel_to_repo(os.path.join(tmp_dir, f.name))
                saved_files.append(saved)

        # 3. Git commit + push
        if do_push:
            progress.progress(0.9, text="📝 Git commit + push...")
            result = commit_and_push(message=commit_msg)
            if result["success"]:
                progress.progress(1.0, text=f"✅ Listo! Commit: {result['commit_hash']}")
                st.success(f"✅ Sync completo. Commit: `{result['commit_hash']}`")
            else:
                progress.progress(1.0, text=f"⚠️ Commit hecho, push falló")
                st.warning(f"⚠️ Commit hecho pero push falló: {result['message']}")
        else:
            progress.progress(1.0, text="✅ Supabase actualizado (sin push)")

        # 4. Log en Supabase
        try:
            client.table("sync_log").insert({
                "fecha": datetime.now().isoformat(),
                "archivos": [f.name for f in [ficha1, ficha2, ninebox, planta] if f],
                "total_cambios": report.total_changes,
                "cambios": report.summary(),
                "estado": "exito",
                "usuario": st.session_state.get("user", "unknown"),
            }).execute()
        except Exception:
            pass  # La tabla puede no existir aún

        st.balloons()


# ── Entry point ─────────────────────────────────────────
if not check_auth():
    login_screen()
else:
    main_app()
