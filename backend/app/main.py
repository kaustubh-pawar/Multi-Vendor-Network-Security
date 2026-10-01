from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import engine, Base
from app.api import (
    audit_routes,
    rules_routes,
    review_routes,
    ml_routes,
    reports_routes,
    device_routes,
    finding_routes,
    remediation_routes,
    auth_routes
)
from app.ml.predictor import load_ml_artifacts

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="ANCP — Multi-Vendor Network Security Compliance Auditor",
    description="Automated multi-vendor network configuration audit engine with deterministic compliance rules and multi-framework mapping (SIH26155 - NTRO).",
    version="2.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register API routers
app.include_router(auth_routes.router)
app.include_router(audit_routes.router)
app.include_router(device_routes.router)
app.include_router(finding_routes.router)
app.include_router(remediation_routes.router)
app.include_router(rules_routes.router)
app.include_router(review_routes.router)
app.include_router(ml_routes.router)
app.include_router(reports_routes.router)

@app.on_event("startup")
def startup_event():
    print("[+] Initializing ANCP Auditor API...")
    load_ml_artifacts()

@app.get("/health")
def health_check():
    return {
        "status": "HEALTHY",
        "service": "ANCP Security Audit Engine",
        "version": "2.0.0",
        "target_vendors": ["Cisco IOS", "Juniper Junos", "Fortinet FortiOS"]
    }
