"""
git_ops.py — Operaciones Git: guardar Excels, commit + push automático.
"""
import os
import shutil
from datetime import datetime
from pathlib import Path

from git import Repo


REPO_PATH = os.getenv("GIT_REPO_PATH", "/Users/nicolassantos/Desktop/Proyectos")


def get_repo() -> Repo:
    return Repo(REPO_PATH)


def save_excel_to_repo(src_path: str, category: str = "ficha") -> str:
    """
    Guarda el Excel en excels_historial/YYYY-MM-DD/ dentro del repo.
    Retorna la ruta destino.
    """
    today = datetime.now().strftime("%Y-%m-%d")
    dest_dir = Path(REPO_PATH) / "excels_historial" / today
    dest_dir.mkdir(parents=True, exist_ok=True)

    filename = Path(src_path).name
    # Evitar overwrite: agregar sufijo si ya existe
    dest = dest_dir / filename
    if dest.exists():
        stem = dest.stem
        suffix = dest.suffix
        counter = 1
        while dest.exists():
            dest = dest_dir / f"{stem}_{counter}{suffix}"
            counter += 1

    shutil.copy2(src_path, dest)
    return str(dest)


def generate_commit_msg(report_summary: dict) -> str:
    """Genera un mensaje de commit automático basado en el resumen del sync."""
    fecha = datetime.now().strftime("%Y-%m-%d %H:%M")
    total = report_summary.get("total_cambios", 0)
    tablas = report_summary.get("tablas", [])

    parts = []
    for t in tablas:
        if t["total"] > 0:
            parts.append(f"{t['tabla']}: +{t['agregados']}/-{t['eliminados']}/↻{t['modificados']}")

    detail = "; ".join(parts) if parts else "sin cambios"
    return f"Sync {fecha} — {total} cambios ({detail})"


def commit_and_push(
    message: str | None = None,
    files_to_add: list[str] | None = None,
) -> dict:
    """
    Agrega archivos al staging, commit y push.
    Retorna {success, message, commit_hash}.
    """
    repo = get_repo()

    # Agregar archivos específicos o todo
    if files_to_add:
        for f in files_to_add:
            repo.index.add(f)
    else:
        repo.index.add(["."])

    # Generar mensaje si no se provee
    if not message:
        now = datetime.now().strftime("%Y-%m-%d %H:%M")
        message = f"Sync automático {now}"

    # Commit
    commit = repo.index.commit(message)
    commit_hash = commit.hexsha[:7]

    # Push
    try:
        origin = repo.remote("origin")
        origin.push(refspec="main:main")
        return {
            "success": True,
            "message": f"Push exitoso: {commit_hash}",
            "commit_hash": commit_hash,
        }
    except Exception as e:
        return {
            "success": False,
            "message": f"Push falló: {str(e)}",
            "commit_hash": commit_hash,
        }


def get_last_commits(n: int = 5) -> list[dict]:
    """Retorna los últimos N commits del repo."""
    repo = get_repo()
    commits = []
    for c in repo.iter_commits(max_count=n):
        commits.append({
            "hash": c.hexsha[:7],
            "message": c.message.strip(),
            "date": datetime.fromtimestamp(c.committed_date).isoformat(),
            "author": str(c.author),
        })
    return commits
