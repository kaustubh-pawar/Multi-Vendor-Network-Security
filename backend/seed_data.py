import sys
from pathlib import Path

# Add backend directory to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

from app.database import engine, SessionLocal, Base
from app.ml.train_model import train_and_save_models
from app.services.audit_service import create_and_run_audit
from app.services.ssh_collector import SAMPLE_CISCO_LIVE, SAMPLE_JUNOS_LIVE, SAMPLE_FORTIOS_LIVE

def seed_database():
    print("[+] Creating database tables...")
    Base.metadata.create_all(bind=engine)

    print("[+] Training initial AI/ML model...")
    train_and_save_models()

    db = SessionLocal()
    try:
        print("[+] Seeding sample audit jobs...")

        # 1. Cisco Core Router
        create_and_run_audit(
            db=db,
            config_text=SAMPLE_CISCO_LIVE,
            hostname="Core-RTR-01.dc1",
            vendor_hint="cisco"
        )

        # 2. Juniper Edge Firewall
        create_and_run_audit(
            db=db,
            config_text=SAMPLE_JUNOS_LIVE,
            hostname="Edge-FW-Junos.dc1",
            vendor_hint="junos"
        )

        # 3. Fortigate Security Appliance
        create_and_run_audit(
            db=db,
            config_text=SAMPLE_FORTIOS_LIVE,
            hostname="FortiGate-500E.corp",
            vendor_hint="fortios"
        )

        print("[SUCCESS] Seed complete! Database ready with sample audits and trained ML model.")
    finally:
        db.close()

if __name__ == "__main__":
    seed_database()
