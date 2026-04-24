from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from sqlalchemy import or_
from typing import List, Optional

from app.core.database import get_db
from app.models.user import User
from app.models.skill import Skill

router = APIRouter(prefix="/search", tags=["Search"])


@router.get("/professionals")
def search_professionals(
    q: Optional[str] = Query(None, description="Search query"),
    verified_only: bool = Query(False, description="Only verified users"),
    min_score: int = Query(0, description="Minimum trust score"),
    skills: Optional[str] = Query(None, description="Comma-separated skills"),
    page: int = Query(1, ge=1),
    limit: int = Query(20, ge=1, le=50),
    db: Session = Depends(get_db),
):
    """Search professionals with filters."""
    query = db.query(User)

    # Text search
    if q:
        search_term = f"%{q}%"
        query = query.filter(
            or_(
                User.name.ilike(search_term),
                User.headline.ilike(search_term),
                User.company.ilike(search_term),
                User.location.ilike(search_term),
                User.about.ilike(search_term),
            )
        )

    # Verified only (score > 25)
    if verified_only:
        query = query.filter(User.trust_score > 25)

    # Minimum score
    if min_score > 0:
        query = query.filter(User.trust_score >= min_score)

    # Skills filter
    if skills:
        skill_list = [s.strip() for s in skills.split(",")]
        query = query.join(Skill).filter(Skill.name.in_(skill_list))

    # Pagination
    total = query.count()
    offset = (page - 1) * limit
    users = query.order_by(User.trust_score.desc()).offset(offset).limit(limit).all()

    results = []
    for user in users:
        user_skills = db.query(Skill).filter(Skill.user_id == user.id).all()
        results.append({
            "id": user.id,
            "name": user.name,
            "lockedin_id": user.lockedin_id,
            "headline": user.headline or "",
            "company": user.company or "",
            "location": user.location or "",
            "profile_image_url": user.profile_image_url or "",
            "trust_score": user.trust_score,
            "verification_level": user.verification_level,
            "skills": [{"name": s.name, "is_verified": s.is_verified} for s in user_skills],
        })

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "results": results,
    }
