from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models.models import AuditJob

router = APIRouter(prefix="/api/devices", tags=["Devices"])

@router.get("/")
def get_monitored_devices(db: Session = Depends(get_db)) -> List[Dict[str, Any]]:
    jobs = db.query(AuditJob).order_by(AuditJob.created_at.desc()).all()
    
    # Unique devices by hostname
    device_map = {}
    for j in jobs:
        if j.hostname not in device_map:
            device_map[j.hostname] = {
                "id": j.id,
                "hostname": j.hostname,
                "vendor": j.vendor,
                "device_type": getattr(j, "device_type", "Core Switch") or "Core Switch",
                "device_model": getattr(j, "device_model", "Catalyst 9300") or "Catalyst 9300",
                "ip_address": f"10.100.{(j.id % 250) + 1}.{(j.id % 254) + 1}",
                "compliance_score": j.compliance_score,
                "status": "COMPLIANT" if j.compliance_score >= 80 else "NON_COMPLIANT",
                "total_rules": j.total_rules,
                "failed_rules": j.failed_rules,
                "passed_rules": j.passed_rules,
                "last_audited": j.created_at.isoformat()
            }

    return list(device_map.values())
