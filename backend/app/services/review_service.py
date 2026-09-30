from sqlalchemy.orm import Session
from typing import List, Dict, Any
from app.models.models import ReviewDecision, Finding

def submit_review_decision(
    db: Session,
    snippet_raw: str,
    vendor: str,
    reviewer_action: str, # CONFIRMED, OVERRIDDEN, REJECTED
    job_id: int = None,
    finding_id: int = None,
    corrected_category: str = None,
    corrected_severity: str = None,
    reviewer_notes: str = None
) -> ReviewDecision:
    decision = ReviewDecision(
        job_id=job_id,
        snippet_raw=snippet_raw,
        vendor=vendor,
        predicted_category="Remote Access",
        predicted_severity="HIGH",
        ai_confidence=0.74,
        reviewer_action=reviewer_action,
        corrected_category=corrected_category,
        corrected_severity=corrected_severity,
        reviewer_notes=reviewer_notes
    )
    db.add(decision)
    db.commit()
    db.refresh(decision)

    if finding_id:
        finding = db.query(Finding).filter(Finding.id == finding_id).first()
        if finding:
            finding.requires_review = False
            if reviewer_action == "OVERRIDDEN" and corrected_severity:
                finding.severity = corrected_severity
            db.commit()

    return decision
