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
    extract_ninebox,
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

def render_data_quality_audit():
    st.markdown("## 🛡️ Auditoría y Calidad de Datos")
    st.markdown("Análisis automático de inconsistencias, colaboradores huérfanos y brechas en la matriz de talento.")

    try:
        client = get_client()
        with st.spinner("Analizando registros en Supabase..."):
            # Fetch personas
            p_res = client.table("personas").select("expediente,nombre,cargo,jefe,gerencia,direccion_comite,ciudades,estado").execute()
            personas = p_res.data or []

            # Fetch ninebox
            nb_res = client.table("ninebox").select("expediente,caja,desempeno,potencial,sucesor,tiempo").execute()
            ninebox = {str(r.get("expediente","")).strip(): r for r in (nb_res.data or [])}

            # Fetch sucesores
            suc_res = client.table("sucesores").select("expediente,sucesor,tiempo").execute()
            sucesores = {str(r.get("expediente","")).strip(): r for r in (suc_res.data or [])}

            # Fetch desempeno
            des_res = client.table("desempeno").select("expediente,y2024,y2025,y2026").execute()
            desempeno = {str(r.get("expediente","")).strip(): r for r in (des_res.data or [])}

        total_p = len(personas)
        if not total_p:
            st.warning("No hay colaboradores en la tabla 'personas'.")
            return

        p_exps = set(str(r.get("expediente","")).strip() for r in personas)
        p_names = set(str(r.get("nombre","")).upper().strip() for r in personas if r.get("nombre"))

        # Inconsistencias
        sin_caja = []
        jefe_huerfano = []
        sin_sucesor_critico = []

        for p in personas:
            exp = str(p.get("expediente","")).strip()
            nb = ninebox.get(exp)
            
            # 1. Sin caja
            if not nb or not nb.get("caja"):
                sin_caja.append({
                    "Expediente": exp,
                    "Nombre": p.get("nombre",""),
                    "Cargo": p.get("cargo",""),
                    "Dirección": p.get("direccion_comite",""),
                    "Gerencia": p.get("gerencia","")
                })
            else:
                caja = int(nb.get("caja", 0))
                # 2. Crítico sin sucesor (Cajas 7, 8, 9)
                if caja in [7, 8, 9]:
                    suc_info = sucesores.get(exp) or nb
                    has_suc = str(suc_info.get("sucesor","")).strip().lower() in ["si", "sí"]
                    if not has_suc:
                        sin_sucesor_critico.append({
                            "Expediente": exp,
                            "Nombre": p.get("nombre",""),
                            "Cargo": p.get("cargo",""),
                            "Caja 9-Box": f"Caja {caja}",
                            "Gerencia": p.get("gerencia","")
                        })

            # 3. Jefe huérfano
            jefe = str(p.get("jefe","")).upper().strip()
            if jefe and jefe != "NO APLICA" and jefe not in p_names:
                jefe_huerfano.append({
                    "Expediente": exp,
                    "Colaborador": p.get("nombre",""),
                    "Jefe Registrado": jefe,
                    "Gerencia": p.get("gerencia","")
                })

        # KPI Metrics Cards
        col1, col2, col3, col4 = st.columns(4)
        with col1:
            st.metric("Total Colaboradores", total_p)
        with col2:
            pct_nb = round((total_p - len(sin_caja)) / total_p * 100, 1)
            st.metric("Cobertura Nine Box", f"{pct_nb}%", delta=f"-{len(sin_caja)} sin caja", delta_color="inverse" if sin_caja else "normal")
        with col3:
            pct_des = round(len(desempeno) / total_p * 100, 1)
            st.metric("Histórico Desempeño", f"{pct_des}%", f"{len(desempeno)} registros")
        with col4:
            st.metric("Talento Crítico sin Sucesor", len(sin_sucesor_critico), delta="Riesgo Sucesión", delta_color="inverse" if sin_sucesor_critico else "normal")

        st.markdown("---")

        # Tabs de Inconsistencias
        tab1, tab2, tab3 = st.tabs([
            f"⚠️ Sin Caja Nine Box ({len(sin_caja)})",
            f"🚨 Talento Crítico sin Sucesor ({len(sin_sucesor_critico)})",
            f"👤 Jefes No Encontrados ({len(jefe_huerfano)})"
        ])

        with tab1:
            if sin_caja:
                st.dataframe(pd.DataFrame(sin_caja), use_container_width=True)
            else:
                st.success("✅ 100% de colaboradores cuentan con evaluación Nine Box.")

        with tab2:
            if sin_sucesor_critico:
                st.warning(f"Se identificaron {len(sin_sucesor_critico)} colaboradores en Cajas 7, 8 y 9 que aún no tienen mapeado su sucesor.")
                st.dataframe(pd.DataFrame(sin_sucesor_critico), use_container_width=True)
            else:
                st.success("✅ Todas las posiciones de talento crítico cuentan con sucesor asignado.")

        with tab3:
            if jefe_huerfano:
                st.info(f"Hay {len(jefe_huerfano)} colaboradores cuyo jefe no se encuentra en el directorio activo.")
                st.dataframe(pd.DataFrame(jefe_huerfano), use_container_width=True)
            else:
                st.success("✅ Toda la estructura jerárquica de líderes está alineada.")

    except Exception as e:
        st.error(f"Error al conectar con Supabase para la auditoría: {e}")


def main_app():
    sidebar()
    tab_sync, tab_audit = st.tabs(["🔄 Sincronización de Excels", "🛡️ Calidad de Datos & Auditoría"])
    with tab_audit:
        render_data_quality_audit()
    with tab_sync:

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
                ninebox_new = {r["expediente"]: r for r in extract_ninebox(ninebox_path)}

                # Fetch actual de Supabase y comparar
                diffs: list[DiffResult] = []

                tables_keyed = [
                    ("personas", personas_new),
                    ("formacion", formacion_new),
                    ("desempeno", desempeno_new),
                    ("talentos", talentos_new),
                    ("objetivos", objetivos_new),
                    ("sucesores", sucesores_new),
                    ("ninebox", ninebox_new),
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
                    ("ninebox", ninebox_new, False),
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
