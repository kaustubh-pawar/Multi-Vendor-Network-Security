from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Dict, Any

from app.database import get_db
from app.models.models import Finding, AuditJob

router = APIRouter(prefix="/api/remediation", tags=["Remediation Center"])

@router.get("/")
def get_remediation_items(
    vendor: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    query = db.query(Finding, AuditJob).join(AuditJob, Finding.job_id == AuditJob.id).filter(Finding.status == "FAIL")

    if vendor and vendor.lower() != "all":
        query = query.filter(AuditJob.vendor == vendor.lower())

    results = []
    for finding, job in query.all():
        results.append({
            "id": finding.id,
            "job_id": job.id,
            "job_number": job.job_number,
            "hostname": job.hostname,
            "vendor": job.vendor,
            "rule_code": finding.rule_code,
            "title": finding.title,
            "severity": finding.severity,
            "category": finding.category,
            "evidence_raw": finding.evidence_raw,
            "remediation_script": finding.remediation,
            "cis_mapping": finding.cis_mapping,
            "nist_mapping": finding.nist_mapping
        })

    return results
