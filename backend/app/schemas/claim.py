from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


class ClaimCreate(BaseModel):
    type: str = Field(..., pattern="^(project|certification|repository|achievement)$")
    title: str = Field(..., min_length=2, max_length=255)
    description: Optional[str] = ""
    credential_id: Optional[str] = None
    external_url: Optional[str] = None


class ClaimResponse(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    description: str
    credential_id: Optional[str] = None
    external_url: Optional[str] = None
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EvidenceCreate(BaseModel):
    type: str = Field(..., pattern="^(document|url|email|screenshot)$")
    file_url: Optional[str] = None
    external_url: Optional[str] = None


class EvidenceResponse(BaseModel):
    id: str
    claim_id: str
    type: str
    file_url: Optional[str] = None
    external_url: Optional[str] = None
    verification_status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class ExperienceCreate(BaseModel):
    title: str = Field(..., min_length=2, max_length=255)
    company: str = Field(..., min_length=1, max_length=255)
    employment_type: Optional[str] = "Full-time"
    location: Optional[str] = ""
    start_date: Optional[str] = None
    end_date: Optional[str] = None  # null = Present
    description: Optional[str] = ""


class ExperienceResponse(BaseModel):
    id: str
    user_id: str
    title: str
    company: str
    employment_type: str
    location: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    description: str
    is_verified: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class EducationCreate(BaseModel):
    institution: str = Field(..., min_length=2, max_length=255)
    degree: Optional[str] = ""
    field_of_study: Optional[str] = ""
    start_date: Optional[str] = None
    end_date: Optional[str] = None


class EducationResponse(BaseModel):
    id: str
    user_id: str
    institution: str
    degree: str
    field_of_study: str
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    is_verified: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class SkillCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)


class SkillResponse(BaseModel):
    id: str
    user_id: str
    name: str
    is_verified: bool

    class Config:
        from_attributes = True


class ConnectionRequest(BaseModel):
    receiver_id: str


class ConnectionResponse(BaseModel):
    id: str
    requester_id: str
    receiver_id: str
    status: str
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class NotificationResponse(BaseModel):
    id: str
    user_id: str
    type: str
    title: str
    message: str
    is_read: bool
    created_at: Optional[datetime] = None

    class Config:
        from_attributes = True


class TrustScoreResponse(BaseModel):
    user_id: str
    trust_score: int
    verification_level: str
    breakdown: dict


class SearchFilters(BaseModel):
    query: Optional[str] = None
    verified_only: Optional[bool] = False
    min_score: Optional[int] = 0
    skills: Optional[List[str]] = None
    industry: Optional[str] = None


class PublicProfileResponse(BaseModel):
    id: str
    name: str
    lockedin_id: str
    headline: str
    company: str
    location: str
    about: str
    profile_image_url: str
    trust_score: int
    verification_level: str
    profile_views: int
    linkedin_url: Optional[str] = None
    github_url: Optional[str] = None
    portfolio_url: Optional[str] = None
    experiences: List[ExperienceResponse] = []
    educations: List[EducationResponse] = []
    skills: List[SkillResponse] = []
    claims: List[ClaimResponse] = []

    class Config:
        from_attributes = True
