from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.claim import Claim
from app.models.evidence import Evidence
from app.schemas.claim import (
    ClaimCreate, ClaimResponse,
    EvidenceCreate, EvidenceResponse,
)

router = APIRouter(prefix="/claims", tags=["Claims & Proofs"])


@router.post("/create", response_model=ClaimResponse, status_code=201)
def create_claim(
    data: ClaimCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit a new professional claim/proof."""
    claim = Claim(
        user_id=current_user.id,
        type=data.type,
        title=data.title,
        description=data.description or "",
        credential_id=data.credential_id,
        external_url=data.external_url,
        status="pending",
    )
    db.add(claim)
    db.commit()
    db.refresh(claim)
    return ClaimResponse.model_validate(claim)


@router.get("/user/{user_id}", response_model=List[ClaimResponse])
def get_user_claims(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get all claims for a user."""
    claims = db.query(Claim).filter(Claim.user_id == user_id).all()
    return [ClaimResponse.model_validate(c) for c in claims]


@router.get("/my", response_model=List[ClaimResponse])
def get_my_claims(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get current user's claims."""
    claims = db.query(Claim).filter(Claim.user_id == current_user.id).all()
    return [ClaimResponse.model_validate(c) for c in claims]


@router.get("/{claim_id}", response_model=ClaimResponse)
def get_claim(
    claim_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Get a single claim with details."""
    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")
    return ClaimResponse.model_validate(claim)


@router.post("/{claim_id}/evidence", response_model=EvidenceResponse, status_code=201)
def add_evidence(
    claim_id: str,
    data: EvidenceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Attach evidence to a claim."""
    claim = db.query(Claim).filter(
        Claim.id == claim_id,
        Claim.user_id == current_user.id,
    ).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found or not yours")

    evidence = Evidence(
        claim_id=claim_id,
        type=data.type,
        file_url=data.file_url,
        external_url=data.external_url,
    )
    db.add(evidence)

    # Move claim to under_review if it was pending
    if claim.status == "pending":
        claim.status = "under_review"

    db.commit()
    db.refresh(evidence)
    return EvidenceResponse.model_validate(evidence)


@router.patch("/{claim_id}/verify", response_model=ClaimResponse)
def verify_claim(
    claim_id: str,
    action: str,  # "verify" or "reject"
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Verify or reject a claim (for reviewers/admins)."""
    if not current_user.is_reviewer:
        raise HTTPException(status_code=403, detail="Only reviewers can verify claims")

    claim = db.query(Claim).filter(Claim.id == claim_id).first()
    if not claim:
        raise HTTPException(status_code=404, detail="Claim not found")

    if action == "verify":
        claim.status = "verified"
    elif action == "reject":
        claim.status = "rejected"
    else:
        raise HTTPException(status_code=400, detail="Action must be 'verify' or 'reject'")

    db.commit()
    db.refresh(claim)
    return ClaimResponse.model_validate(claim)
