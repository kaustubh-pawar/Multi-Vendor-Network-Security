from sqlalchemy import Column, Integer, String, Float, Boolean, Text, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from datetime import datetime
from app.database import Base

class AuditJob(Base):
    __tablename__ = "audit_jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_number = Column(String(64), unique=True, index=True)
    status = Column(String(32), default="COMPLETED") # COMPLETED, RUNNING, FAILED
    vendor = Column(String(32), index=True) # cisco, junos, fortios, unknown
    hostname = Column(String(128), default="Unknown-Device")
    device_type = Column(String(64), default="Core Switch")
    device_model = Column(String(64), default="Catalyst 9300")
    total_rules = Column(Integer, default=0)
    passed_rules = Column(Integer, default=0)
    failed_rules = Column(Integer, default=0)
    na_rules = Column(Integer, default=0)
    compliance_score = Column(Float, default=0.0) # Percentage 0.0 - 100.0
    created_at = Column(DateTime, default=datetime.utcnow)
    file_path = Column(String(512), nullable=True)
    file_hash = Column(String(64), nullable=True)
    raw_config = Column(Text, nullable=True)

    findings = relationship("Finding", back_populates="job", cascade="all, delete-orphan")
    review_decisions = relationship("ReviewDecision", back_populates="job")

class Finding(Base):
    __tablename__ = "findings"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("audit_jobs.id"))
    rule_code = Column(String(64), index=True)
    title = Column(String(256))
    category = Column(String(64)) # Auth, Remote Access, Logging, ACL, SNMP, NTP, Encryption, Admin
    severity = Column(String(16)) # CRITICAL, HIGH, MEDIUM, LOW, INFO
    status = Column(String(16)) # FAIL, PASS, N_A
    evidence_start_line = Column(Integer, default=0)
    evidence_end_line = Column(Integer, default=0)
    evidence_raw = Column(Text, nullable=True)
    remediation = Column(Text, nullable=True)
    
    # Framework Mappings
    cis_mapping = Column(String(128), nullable=True)
    nist_mapping = Column(String(128), nullable=True)
    stig_mapping = Column(String(128), nullable=True)
    iso_mapping = Column(String(128), nullable=True)

    # AI Assist Metadata
    ai_confidence = Column(Float, default=1.0)
    is_ai_assisted = Column(Boolean, default=False)
    requires_review = Column(Boolean, default=False)

    job = relationship("AuditJob", back_populates="findings")

class ComplianceRule(Base):
    __tablename__ = "compliance_rules"

    id = Column(Integer, primary_key=True, index=True)
    rule_code = Column(String(64), unique=True, index=True)
    title = Column(String(256))
    category = Column(String(64))
    vendor = Column(String(32)) # cisco, junos, fortios, all
    default_severity = Column(String(16))
    description = Column(Text)
    remediation_guidance = Column(Text)
    cis_mapping = Column(String(128))
    nist_mapping = Column(String(128))
    stig_mapping = Column(String(128))
    iso_mapping = Column(String(128))

class ReviewDecision(Base):
    __tablename__ = "review_decisions"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(Integer, ForeignKey("audit_jobs.id"), nullable=True)
    snippet_raw = Column(Text)
    vendor = Column(String(32))
    predicted_category = Column(String(64))
    predicted_severity = Column(String(16))
    ai_confidence = Column(Float)
    reviewer_action = Column(String(32)) # CONFIRMED, OVERRIDDEN, REJECTED
    corrected_category = Column(String(64), nullable=True)
    corrected_severity = Column(String(16), nullable=True)
    reviewer_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    job = relationship("AuditJob", back_populates="review_decisions")

class MLModelVersion(Base):
    __tablename__ = "ml_model_versions"

    id = Column(Integer, primary_key=True, index=True)
    version = Column(String(32), unique=True)
    accuracy = Column(Float)
    f1_score = Column(Float)
    sample_count = Column(Integer)
    trained_at = Column(DateTime, default=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    model_card = Column(JSON, nullable=True)

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(128))
    email = Column(String(128), unique=True, index=True)
    access_key = Column(String(128))
    clearance = Column(String(64), default="L4 Lead Clearance")
    role = Column(String(64), default="Security Auditor")
    is_verified = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
