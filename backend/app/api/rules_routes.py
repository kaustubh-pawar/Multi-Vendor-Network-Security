from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.engine.rules_catalog import RULES_CATALOG

router = APIRouter(prefix="/api/rules", tags=["Rules & Frameworks"])

@router.get("/")
def get_all_rules(vendor: Optional[str] = None, category: Optional[str] = None):
    results = RULES_CATALOG
    if vendor and vendor != "all":
        results = [r for r in results if r["vendor"] in [vendor, "all"]]
    if category:
        results = [r for r in results if r["category"].lower() == category.lower()]
    return results

@router.get("/frameworks")
def get_framework_stats():
    cis_count = sum(1 for r in RULES_CATALOG if r.get("cis_mapping"))
    nist_count = sum(1 for r in RULES_CATALOG if r.get("nist_mapping"))
    stig_count = sum(1 for r in RULES_CATALOG if r.get("stig_mapping"))
    iso_count = sum(1 for r in RULES_CATALOG if r.get("iso_mapping"))

    return {
        "supported_frameworks": [
            {"id": "cis", "name": "CIS Benchmarks (L1/L2)", "rule_count": cis_count},
            {"id": "nist", "name": "NIST SP 800-53 Rev 5", "rule_count": nist_count},
            {"id": "stig", "name": "DISA STIG Security Requirements", "rule_count": stig_count},
            {"id": "iso", "name": "ISO 27001:2022 Annex A", "rule_count": iso_count}
        ]
    }
