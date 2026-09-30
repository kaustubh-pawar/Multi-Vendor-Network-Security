import hashlib
import uuid
from datetime import datetime
from sqlalchemy.orm import Session

from app.models.models import AuditJob, Finding
from app.parsers.detector import detect_vendor
from app.parsers.cisco_parser import parse_cisco_config
from app.parsers.junos_parser import parse_junos_config
from app.parsers.fortios_parser import parse_fortios_config
from app.engine.rule_engine import evaluate_compliance
from app.ml.predictor import predict_pattern

def create_and_run_audit(
    db: Session,
    config_text: str,
    hostname: str = "Network-Device-01",
    vendor_hint: str = "auto"
) -> AuditJob:
    job_uuid = f"JOB-{uuid.uuid4().hex[:8].upper()}"
    file_hash = hashlib.sha256(config_text.encode("utf-8")).hexdigest()

    vendor, os_family, confidence = detect_vendor(config_text, hint=vendor_hint)

    # Parse config to IR
    if vendor == "junos":
        ir = parse_junos_config(config_text, device_ref=hostname)
    elif vendor == "fortios":
        ir = parse_fortios_config(config_text, device_ref=hostname)
    else:
        ir = parse_cisco_config(config_text, device_ref=hostname)

    # Run compliance engine
    raw_findings = evaluate_compliance(ir)

    total_rules = len(raw_findings)
    passed_count = sum(1 for f in raw_findings if f["status"] == "PASS")
    failed_count = sum(1 for f in raw_findings if f["status"] == "FAIL")
    na_count = sum(1 for f in raw_findings if f["status"] == "N_A")

    compliance_score = round((passed_count / total_rules * 100.0), 1) if total_rules > 0 else 100.0

    # Infer Device Type and Model
    v_lower = (vendor or "").lower()
    h_lower = (hostname or "").lower()
    if "cisco" in v_lower:
        if "sw" in h_lower or "switch" in h_lower:
            dtype, dmodel = "Distribution Switch", "Catalyst 9300"
        elif "rtr" in h_lower or "router" in h_lower or "gw" in h_lower:
            dtype, dmodel = "Edge Router", "ISR 4451"
        else:
            dtype, dmodel = "Core Switch", "Catalyst 9500"
    elif "junos" in v_lower or "juniper" in v_lower:
        if "srx" in h_lower or "fw" in h_lower:
            dtype, dmodel = "Next-Gen Firewall", "SRX300"
        elif "qfx" in h_lower or "sw" in h_lower:
            dtype, dmodel = "DC Leaf Switch", "QFX5120"
        else:
            dtype, dmodel = "Core Router", "MX240"
    elif "forti" in v_lower:
        dtype, dmodel = "Next-Gen Firewall", "FortiGate 100F"
    else:
        dtype, dmodel = "Network Security Node", "Enterprise v2.0"

    job = AuditJob(
        job_number=job_uuid,
        status="COMPLETED",
        vendor=vendor,
        hostname=hostname,
        device_type=dtype,
        device_model=dmodel,
        total_rules=total_rules,
        passed_rules=passed_count,
        failed_rules=failed_count,
        na_rules=na_count,
        compliance_score=compliance_score,
        created_at=datetime.utcnow(),
        file_hash=file_hash,
        raw_config=config_text
    )
    db.add(job)
    db.commit()
    db.refresh(job)

    # Add findings
    for rf in raw_findings:
        finding = Finding(
            job_id=job.id,
            rule_code=rf["rule_code"],
            title=rf["title"],
            category=rf["category"],
            severity=rf["severity"],
            status=rf["status"],
            evidence_start_line=rf["evidence_start_line"],
            evidence_end_line=rf["evidence_end_line"],
            evidence_raw=rf["evidence_raw"],
            remediation=rf["remediation"],
            cis_mapping=rf.get("cis_mapping"),
            nist_mapping=rf.get("nist_mapping"),
            stig_mapping=rf.get("stig_mapping"),
            iso_mapping=rf.get("iso_mapping"),
            ai_confidence=rf["ai_confidence"],
            is_ai_assisted=rf["is_ai_assisted"],
            requires_review=rf["requires_review"]
        )
        db.add(finding)

    db.commit()
    db.refresh(job)
    return job
