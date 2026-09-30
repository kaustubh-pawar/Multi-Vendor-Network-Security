from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.models import AuditJob
from app.services.report_service import generate_pdf_report, generate_excel_report

router = APIRouter(prefix="/api/reports", tags=["Reports & Exports"])

@router.get("/pdf/{job_id}")
def download_pdf_report(job_id: int, db: Session = Depends(get_db)):
    job = db.query(AuditJob).filter(AuditJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Audit Job Not Found")

    pdf_bytes = generate_pdf_report(job)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=Audit_Report_{job.job_number}.pdf"}
    )

@router.get("/excel/{job_id}")
def download_excel_report(job_id: int, db: Session = Depends(get_db)):
    job = db.query(AuditJob).filter(AuditJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Audit Job Not Found")

    excel_bytes = generate_excel_report(job)
    return Response(
        content=excel_bytes,
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=Audit_Report_{job.job_number}.xlsx"}
    )
