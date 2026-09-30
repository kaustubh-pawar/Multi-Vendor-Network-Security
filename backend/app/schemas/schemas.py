from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

class AuditJobCreate(BaseModel):
    hostname: Optional[str] = "Unknown-Device"
    vendor_hint: Optional[str] = "auto"
    config_text: Optional[str] = None

class SSHDeviceConnect(BaseModel):
    hostname: str
    ip_address: str
    port: int = 22
    vendor: str # cisco, junos, fortios
    username: str
    password: str

class FindingResponse(BaseModel):
    id: int
    job_id: Optional[int] = None
    hostname: Optional[str] = "Unknown-Host"
    vendor: Optional[str] = "cisco"
    rule_code: str
    title: str
    category: str
    severity: str
    status: str
    evidence_start_line: Optional[int] = 0
    evidence_end_line: Optional[int] = 0
    evidence_raw: Optional[str] = None
    remediation: Optional[str] = None
    cis_mapping: Optional[str] = None
    nist_mapping: Optional[str] = None
    stig_mapping: Optional[str] = None
    iso_mapping: Optional[str] = None
    ai_confidence: Optional[float] = 0.78
    is_ai_assisted: Optional[bool] = True
    requires_review: Optional[bool] = True

    class Config:
        from_attributes = True

class AuditJobResponse(BaseModel):
    id: int
    job_number: str
    status: str
    vendor: str
    hostname: str
    device_type: Optional[str] = "Core Switch"
    device_model: Optional[str] = "Catalyst 9300"
    total_rules: int
    passed_rules: int
    failed_rules: int
    na_rules: int
    compliance_score: float
    created_at: datetime
    file_path: Optional[str] = None
    file_hash: Optional[str] = None
    findings: List[FindingResponse] = []

    class Config:
        from_attributes = True

class AuditJobSummary(BaseModel):
    id: int
    job_number: str
    status: str
    vendor: str
    hostname: str
    device_type: Optional[str] = "Core Switch"
    device_model: Optional[str] = "Catalyst 9300"
    total_rules: int
    passed_rules: int
    failed_rules: int
    compliance_score: float
    created_at: datetime

    class Config:
        from_attributes = True

class ComplianceRuleSchema(BaseModel):
    id: int
    rule_code: str
    title: str
    category: str
    vendor: str
    default_severity: str
    description: str
    remediation_guidance: str
    cis_mapping: Optional[str] = None
    nist_mapping: Optional[str] = None
    stig_mapping: Optional[str] = None
    iso_mapping: Optional[str] = None

    class Config:
        from_attributes = True

class ReviewDecisionCreate(BaseModel):
    job_id: Optional[int] = None
    finding_id: Optional[int] = None
    snippet_raw: str
    vendor: str
    reviewer_action: str # CONFIRMED, OVERRIDDEN, REJECTED
    corrected_category: Optional[str] = None
    corrected_severity: Optional[str] = None
    reviewer_notes: Optional[str] = None

class MLPredictRequest(BaseModel):
    snippet: str
    vendor: Optional[str] = "cisco"

class MLPredictResponse(BaseModel):
    snippet: str
    predicted_category: str
    predicted_severity: str
    confidence: float
    requires_review: bool
    similar_rules: List[Dict[str, Any]] = []

class MLModelMetrics(BaseModel):
    version: str
    accuracy: float
    f1_score: float
    sample_count: int
    trained_at: str
    model_card: Dict[str, Any]
