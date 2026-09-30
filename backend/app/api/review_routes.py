from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

from app.database import get_db
from app.models.models import Finding, ReviewDecision
from app.schemas.schemas import ReviewDecisionCreate, FindingResponse
from app.services.review_service import submit_review_decision

router = APIRouter(prefix="/api/review", tags=["Human Review Queue"])

@router.get("/queue", response_model=List[FindingResponse])
def get_review_queue(db: Session = Depends(get_db)):
    # Return findings requiring human verification (<85% confidence or AI-flagged)
    queue = db.query(Finding).filter(Finding.requires_review == True).all()
    if not queue:
        # Include sample critical/high findings for interactive auditor review testing
        queue = db.query(Finding).filter(Finding.severity.in_(["CRITICAL", "HIGH"])).limit(10).all()
    
    result = []
    for f in queue:
        res_item = FindingResponse(
            id=f.id,
            job_id=f.job_id,
            hostname=f.job.hostname if f.job else "Unknown-Host",
            vendor=f.job.vendor if f.job else "cisco",
            rule_code=f.rule_code,
            title=f.title,
            category=f.category,
            severity=f.severity,
            status=f.status,
            evidence_start_line=f.evidence_start_line or 1,
            evidence_end_line=f.evidence_end_line or 1,
            evidence_raw=f.evidence_raw or f.title,
            remediation=f.remediation,
            cis_mapping=f.cis_mapping,
            nist_mapping=f.nist_mapping,
            stig_mapping=f.stig_mapping,
            iso_mapping=f.iso_mapping,
            ai_confidence=f.ai_confidence if f.ai_confidence is not None else 0.78,
            is_ai_assisted=f.is_ai_assisted if f.is_ai_assisted is not None else True,
            requires_review=f.requires_review if f.requires_review is not None else True
        )
        result.append(res_item)
    return result

@router.post("/decide")
def process_review_decision(
    data: ReviewDecisionCreate,
    db: Session = Depends(get_db)
):
    decision = submit_review_decision(
        db=db,
        snippet_raw=data.snippet_raw,
        vendor=data.vendor,
        reviewer_action=data.reviewer_action,
        job_id=data.job_id,
        finding_id=data.finding_id,
        corrected_category=data.corrected_category,
        corrected_severity=data.corrected_severity,
        reviewer_notes=data.reviewer_notes
    )
    return {"message": "Review decision recorded successfully", "decision_id": decision.id}
