from datetime import date
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List, Optional

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.experience import Experience
from app.models.education import Education
from app.models.skill import Skill
from app.models.claim import Claim
from app.models.scraped_profile import ScrapedProfile
from app.schemas.user import UserResponse, UserUpdate, ProfileLinksUpdate
from app.schemas.claim import (
    ExperienceCreate, ExperienceResponse,
    EducationCreate, EducationResponse,
    SkillCreate, SkillResponse,
    PublicProfileResponse, ClaimResponse,
)
from app.services.trust_engine import calculate_trust_score

router = APIRouter(prefix="/profile", tags=["Profile"])


@router.get("/{lockedin_id}", response_model=PublicProfileResponse)
def get_public_profile(lockedin_id: str, db: Session = Depends(get_db)):
    """Get public profile by LockedIn ID. Shows verified data only."""
    user = db.query(User).filter(User.lockedin_id == lockedin_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Profile not found")

    # Increment profile views
    user.profile_views += 1
    db.commit()

    # Only return verified claims
    verified_claims = [c for c in user.claims if c.status == "verified"]

    return PublicProfileResponse(
        id=user.id,
        name=user.name,
        lockedin_id=user.lockedin_id,
        headline=user.headline or "",
        company=user.company or "",
        location=user.location or "",
        about=user.about or "",
        profile_image_url=user.profile_image_url or "",
        trust_score=user.trust_score,
        verification_level=user.verification_level,
        profile_views=user.profile_views,
        linkedin_url=user.linkedin_url,
        github_url=user.github_url,
        portfolio_url=user.portfolio_url,
        experiences=[ExperienceResponse(
            id=e.id, user_id=e.user_id, title=e.title, company=e.company,
            employment_type=e.employment_type or "", location=e.location or "",
            start_date=str(e.start_date) if e.start_date else None,
            end_date=str(e.end_date) if e.end_date else None,
            description=e.description or "", is_verified=e.is_verified,
            created_at=e.created_at,
        ) for e in user.experiences],
        educations=[EducationResponse(
            id=e.id, user_id=e.user_id, institution=e.institution,
            degree=e.degree or "", field_of_study=e.field_of_study or "",
            start_date=str(e.start_date) if e.start_date else None,
            end_date=str(e.end_date) if e.end_date else None,
            is_verified=e.is_verified, created_at=e.created_at,
        ) for e in user.educations],
        skills=[SkillResponse.model_validate(s) for s in user.skills],
        claims=[ClaimResponse.model_validate(c) for c in verified_claims],
    )


@router.put("/update", response_model=UserResponse)
def update_profile(
    data: UserUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Update own profile fields."""
    update_data = data.model_dump(exclude_unset=True)
    for key, value in update_data.items():
        setattr(current_user, key, value)

    # Recalculate trust score
    scraped = db.query(ScrapedProfile).filter(ScrapedProfile.user_id == current_user.id).all()
    result = calculate_trust_score(
        current_user, current_user.claims, current_user.experiences,
        current_user.educations, current_user.skills, scraped,
    )
    current_user.trust_score = result["trust_score"]
    current_user.verification_level = result["verification_level"]

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)


@router.post("/experience", response_model=ExperienceResponse, status_code=201)
def add_experience(
    data: ExperienceCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add a work experience entry."""
    exp = Experience(
        user_id=current_user.id,
        title=data.title,
        company=data.company,
        employment_type=data.employment_type or "Full-time",
        location=data.location or "",
        start_date=date.fromisoformat(data.start_date) if data.start_date else None,
        end_date=date.fromisoformat(data.end_date) if data.end_date else None,
        description=data.description or "",
    )
    db.add(exp)
    db.commit()
    db.refresh(exp)

    return ExperienceResponse(
        id=exp.id, user_id=exp.user_id, title=exp.title, company=exp.company,
        employment_type=exp.employment_type, location=exp.location or "",
        start_date=str(exp.start_date) if exp.start_date else None,
        end_date=str(exp.end_date) if exp.end_date else None,
        description=exp.description or "", is_verified=exp.is_verified,
        created_at=exp.created_at,
    )


@router.post("/education", response_model=EducationResponse, status_code=201)
def add_education(
    data: EducationCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add an education entry."""
    edu = Education(
        user_id=current_user.id,
        institution=data.institution,
        degree=data.degree or "",
        field_of_study=data.field_of_study or "",
        start_date=date.fromisoformat(data.start_date) if data.start_date else None,
        end_date=date.fromisoformat(data.end_date) if data.end_date else None,
    )
    db.add(edu)
    db.commit()
    db.refresh(edu)

    return EducationResponse(
        id=edu.id, user_id=edu.user_id, institution=edu.institution,
        degree=edu.degree or "", field_of_study=edu.field_of_study or "",
        start_date=str(edu.start_date) if edu.start_date else None,
        end_date=str(edu.end_date) if edu.end_date else None,
        is_verified=edu.is_verified, created_at=edu.created_at,
    )


@router.post("/skills", response_model=List[SkillResponse], status_code=201)
def add_skills(
    data: List[SkillCreate],
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Add one or more skills."""
    new_skills = []
    for skill_data in data:
        # Skip duplicates
        existing = db.query(Skill).filter(
            Skill.user_id == current_user.id,
            Skill.name == skill_data.name,
        ).first()
        if not existing:
            skill = Skill(user_id=current_user.id, name=skill_data.name)
            db.add(skill)
            new_skills.append(skill)

    db.commit()
    for s in new_skills:
        db.refresh(s)

    return [SkillResponse.model_validate(s) for s in new_skills]


@router.post("/links", response_model=UserResponse)
def update_links(
    data: ProfileLinksUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Submit professional links for scraping validation."""
    if data.linkedin_url is not None:
        current_user.linkedin_url = data.linkedin_url
    if data.github_url is not None:
        current_user.github_url = data.github_url
    if data.portfolio_url is not None:
        current_user.portfolio_url = data.portfolio_url
    if data.freelance_url is not None:
        current_user.freelance_url = data.freelance_url

    db.commit()
    db.refresh(current_user)
    return UserResponse.model_validate(current_user)
