import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
STORAGE_DIR = BASE_DIR / "storage"
MODEL_DIR = BASE_DIR / "app" / "ml" / "model_artifacts"

STORAGE_DIR.mkdir(parents=True, exist_ok=True)
MODEL_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_URL = os.getenv("DATABASE_URL", f"sqlite:///{STORAGE_DIR / 'ancp_auditor.db'}")
SECRET_KEY = os.getenv("SECRET_KEY", "ancp-super-secret-security-key-2026")
CONFIDENCE_THRESHOLD = float(os.getenv("CONFIDENCE_THRESHOLD", "0.85"))
