from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.scraped_profile import ScrapedProfile
from app.schemas.claim import TrustScoreResponse
from app.services.trust_engine import calculate_trust_score

router = APIRouter(prefix="/trust", tags=["Trust Score"])


@router.get("/{user_id}", response_model=TrustScoreResponse)
def get_trust_score(user_id: str, db: Session = Depends(get_db)):
    """Get trust score with detailed breakdown for a user."""
    user = db.query(User).filter(User.id == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    scraped = db.query(ScrapedProfile).filter(ScrapedProfile.user_id == user_id).all()

    result = calculate_trust_score(
        user, user.claims, user.experiences,
        user.educations, user.skills, scraped,
    )

    # Update user's stored score
    user.trust_score = result["trust_score"]
    user.verification_level = result["verification_level"]
    db.commit()

    return TrustScoreResponse(
        user_id=user_id,
        trust_score=result["trust_score"],
        verification_level=result["verification_level"],
        breakdown=result["breakdown"],
    )
