from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Response
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.schemas.schemas import AuditJobResponse, AuditJobSummary, SSHDeviceConnect
from app.services.audit_service import create_and_run_audit
from app.services.ssh_collector import fetch_ssh_configuration
from app.services.pdf_template_generator import generate_pdf_config_template, extract_text_from_pdf_bytes
from app.models.models import AuditJob

router = APIRouter(prefix="/api/audit", tags=["Audit Jobs"])

@router.get("/template/pdf")
def download_pdf_config_template(
    vendor: str = "cisco",
    hostname: str = "Cisco-Core-Switch-01"
):
    pdf_bytes = generate_pdf_config_template(hostname=hostname, vendor=vendor)
    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="Network_Configuration_Template_{vendor}.pdf"'
        }
    )

@router.post("/upload", response_model=AuditJobResponse)
async def upload_audit_file(
    file: UploadFile = File(...),
    hostname: Optional[str] = Form("Uploaded-Device"),
    vendor_hint: Optional[str] = Form("auto"),
    db: Session = Depends(get_db)
):
    content_bytes = await file.read()
    
    # Check if uploaded file is a PDF configuration file
    if file.filename.lower().endswith(".pdf") or content_bytes.startswith(b"%PDF"):
        config_text = extract_text_from_pdf_bytes(content_bytes)
    else:
        config_text = content_bytes.decode("utf-8", errors="ignore")

    if not config_text.strip():
        raise HTTPException(status_code=400, detail="Uploaded configuration file is empty or could not be parsed.")

    job = create_and_run_audit(
        db=db,
        config_text=config_text,
        hostname=hostname or file.filename.replace(".pdf", "").replace(".cfg", "").replace(".txt", ""),
        vendor_hint=vendor_hint
    )
    return job

@router.post("/ssh", response_model=AuditJobResponse)
def ssh_audit_device(
    connect_data: SSHDeviceConnect,
    db: Session = Depends(get_db)
):
    try:
        config_text = fetch_ssh_configuration(
            hostname=connect_data.hostname,
            ip_address=connect_data.ip_address,
            port=connect_data.port,
            vendor=connect_data.vendor,
            username=connect_data.username,
            password=connect_data.password
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SSH Connection Failed: {str(e)}")

    job = create_and_run_audit(
        db=db,
        config_text=config_text,
        hostname=connect_data.hostname,
        vendor_hint=connect_data.vendor
    )
    return job

@router.get("/jobs", response_model=List[AuditJobSummary])
def list_audit_jobs(db: Session = Depends(get_db)):
    jobs = db.query(AuditJob).order_by(AuditJob.created_at.desc()).all()
    return jobs

@router.get("/jobs/{job_id}", response_model=AuditJobResponse)
def get_audit_job(job_id: int, db: Session = Depends(get_db)):
    job = db.query(AuditJob).filter(AuditJob.id == job_id).first()
    if not job:
        raise HTTPException(status_code=404, detail="Audit Job Not Found")
    return job
