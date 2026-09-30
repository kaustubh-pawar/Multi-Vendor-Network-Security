from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from typing import List, Optional, Dict, Any

from app.database import get_db
from app.models.models import Finding, AuditJob

router = APIRouter(prefix="/api/findings", tags=["Security Findings"])

@router.get("/")
def get_all_findings(
    severity: Optional[str] = Query(None),
    vendor: Optional[str] = Query(None),
    status: Optional[str] = Query(None),
    db: Session = Depends(get_db)
) -> List[Dict[str, Any]]:
    query = db.query(Finding, AuditJob).join(AuditJob, Finding.job_id == AuditJob.id)

    if severity and severity.upper() != "ALL":
        query = query.filter(Finding.severity == severity.upper())

    if status and status.upper() != "ALL":
        query = query.filter(Finding.status == status.upper())

    if vendor and vendor.lower() != "all":
        query = query.filter(AuditJob.vendor == vendor.lower())

    results = []
    for finding, job in query.order_by(Finding.id.desc()).all():
        results.append({
            "id": finding.id,
            "job_id": job.id,
            "job_number": job.job_number,
            "hostname": job.hostname,
            "vendor": job.vendor,
            "rule_code": finding.rule_code,
            "title": finding.title,
            "category": finding.category,
            "severity": finding.severity,
            "status": finding.status,
            "evidence_start_line": finding.evidence_start_line,
            "evidence_raw": finding.evidence_raw,
            "remediation": finding.remediation,
            "cis_mapping": finding.cis_mapping,
            "nist_mapping": finding.nist_mapping,
            "stig_mapping": finding.stig_mapping,
            "iso_mapping": finding.iso_mapping
        })

    return results

@router.get("/summary")
def get_findings_summary(db: Session = Depends(get_db)):
    all_findings = db.query(Finding).all()
    critical = sum(1 for f in all_findings if f.severity == "CRITICAL" and f.status == "FAIL")
    high = sum(1 for f in all_findings if f.severity == "HIGH" and f.status == "FAIL")
    medium = sum(1 for f in all_findings if f.severity == "MEDIUM" and f.status == "FAIL")
    low = sum(1 for f in all_findings if f.severity == "LOW" and f.status == "FAIL")
    total_passed = sum(1 for f in all_findings if f.status == "PASS")
    total_failed = sum(1 for f in all_findings if f.status == "FAIL")

    return {
        "critical_count": critical,
        "high_count": high,
        "medium_count": medium,
        "low_count": low,
        "total_passed": total_passed,
        "total_failed": total_failed,
        "total_findings": len(all_findings)
    }
