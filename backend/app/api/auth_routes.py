from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
from pydantic import BaseModel
from datetime import datetime

from app.database import get_db
from app.models.models import User

router = APIRouter(prefix="/api/auth", tags=["Authentication"])

class UserRegisterSchema(BaseModel):
    name: str
    email: str
    accessKey: str
    clearance: Optional[str] = "L4 Lead Clearance"
    role: Optional[str] = "Security Auditor"

class UserLoginSchema(BaseModel):
    email: str
    accessKey: str

class UserResponseSchema(BaseModel):
    id: int
    name: str
    email: str
    clearance: str
    role: str
    is_verified: bool

    class Config:
        from_attributes = True

INITIAL_USERS = [
    {
        "name": "Kaustubh Pawar",
        "email": "kaustubh1006p@gmail.com",
        "accessKey": "threat2risk",
        "clearance": "L4 Lead Clearance",
        "role": "Principal Compliance Auditor",
    },
    {
        "name": "Lead Security Auditor",
        "email": "auditor@ancp.io",
        "accessKey": "ancp123",
        "clearance": "L4 Lead Clearance",
        "role": "Lead Security Auditor",
    },
    {
        "name": "CISO Administrator",
        "email": "ciso@ancp.io",
        "accessKey": "ancp123",
        "clearance": "Executive Clearance",
        "role": "Chief Information Security Officer",
    },
]

def seed_initial_users(db: Session):
    for u in INITIAL_USERS:
        existing = db.query(User).filter(User.email == u["email"].lower().strip()).first()
        if not existing:
            new_u = User(
                name=u["name"],
                email=u["email"].lower().strip(),
                access_key=u["accessKey"],
                clearance=u["clearance"],
                role=u["role"],
                is_verified=True,
            )
            db.add(new_u)
    db.commit()

@router.get("/users", response_model=List[UserResponseSchema])
def list_registered_users(db: Session = Depends(get_db)):
    seed_initial_users(db)
    return db.query(User).order_by(User.id.asc()).all()

@router.post("/register")
def register_user(data: UserRegisterSchema, db: Session = Depends(get_db)):
    seed_initial_users(db)
    clean_email = data.email.lower().strip()
    existing = db.query(User).filter(User.email == clean_email).first()
    if existing:
        raise HTTPException(
            status_code=400,
            detail=f"Email identity '{clean_email}' is already registered. Please log in using SECURE ACCESS."
        )

    new_user = User(
        name=data.name.strip(),
        email=clean_email,
        access_key=data.accessKey,
        clearance=data.clearance or "L4 Lead Clearance",
        role=data.role or "Security Auditor",
        is_verified=True,
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return {
        "success": True,
        "user": {
            "name": new_user.name,
            "email": new_user.email,
            "clearance": new_user.clearance,
            "role": new_user.role,
        }
    }

@router.post("/login")
def login_user(data: UserLoginSchema, db: Session = Depends(get_db)):
    seed_initial_users(db)
    clean_email = data.email.lower().strip()
    user = db.query(User).filter(User.email == clean_email).first()

    if not user:
        raise HTTPException(
            status_code=401,
            detail=f"ERR_UNAUTHORIZED: Identity '{clean_email}' is not registered. You MUST complete Auditor Registration first."
        )

    if user.access_key != data.accessKey:
        raise HTTPException(
            status_code=401,
            detail=f"ERR_INVALID_KEY: Incorrect Access Key for identity '{clean_email}'."
        )

    return {
        "success": True,
        "user": {
            "name": user.name,
            "email": user.email,
            "clearance": user.clearance,
            "role": user.role,
        }
    }
