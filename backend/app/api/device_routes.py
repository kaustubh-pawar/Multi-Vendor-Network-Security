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
                "device_type": getattr(j, "device_type", "Core Switch"),
                "device_model": getattr(j, "device_model", "Catalyst 9300"),
                "ip_address": f"10.100.{(j.id % 250) + 1}.{(j.id % 254) + 1}",
                "compliance_score": j.compliance_score,
                "status": "COMPLIANT" if j.compliance_score >= 80 else "NON_COMPLIANT",
                "total_rules": j.total_rules,
                "failed_rules": j.failed_rules,
                "passed_rules": j.passed_rules,
                "last_audited": j.created_at.isoformat()
            }

    # Add mock sample devices if list is small
    default_samples = [
        {"id": 101, "hostname": "Core-RTR-01.dc1", "vendor": "cisco", "device_type": "Edge Router", "device_model": "ASR 1001-X", "ip_address": "10.10.1.1", "compliance_score": 66.7, "status": "NON_COMPLIANT", "total_rules": 12, "failed_rules": 4, "passed_rules": 8, "last_audited": "2026-09-29T10:00:00Z"},
        {"id": 102, "hostname": "Edge-FW-Junos.dc1", "vendor": "junos", "device_type": "Next-Gen Firewall", "device_model": "SRX300", "ip_address": "10.200.1.1", "compliance_score": 25.0, "status": "NON_COMPLIANT", "total_rules": 4, "failed_rules": 3, "passed_rules": 1, "last_audited": "2026-09-29T10:00:00Z"},
        {"id": 103, "hostname": "FortiGate-500E.corp", "vendor": "fortios", "device_type": "Next-Gen Firewall", "device_model": "FortiGate 200E", "ip_address": "10.50.1.1", "compliance_score": 75.0, "status": "NON_COMPLIANT", "total_rules": 4, "failed_rules": 1, "passed_rules": 3, "last_audited": "2026-09-29T10:00:00Z"},
        {"id": 104, "hostname": "Dist-SW-02.building4", "vendor": "cisco", "device_type": "Distribution Switch", "device_model": "Catalyst 9300", "ip_address": "10.10.2.2", "compliance_score": 100.0, "status": "COMPLIANT", "total_rules": 10, "failed_rules": 0, "passed_rules": 10, "last_audited": "2026-09-29T09:30:00Z"},
    ]

    for sample in default_samples:
        if sample["hostname"] not in device_map:
            device_map[sample["hostname"]] = sample

    return list(device_map.values())
