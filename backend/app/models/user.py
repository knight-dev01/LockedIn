import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Integer, Boolean, DateTime, Text
from sqlalchemy.orm import relationship

from app.core.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    name = Column(String(100), nullable=False)
    email = Column(String(255), unique=True, nullable=False, index=True)
    password_hash = Column(String(255), nullable=False)
    lockedin_id = Column(String(100), unique=True, nullable=False, index=True)
    headline = Column(String(255), nullable=True, default="")
    company = Column(String(255), nullable=True, default="")
    location = Column(String(255), nullable=True, default="")
    about = Column(Text, nullable=True, default="")
    profile_image_url = Column(String(500), nullable=True, default="")
    trust_score = Column(Integer, default=0)
    verification_level = Column(String(50), default="basic")
    profile_views = Column(Integer, default=0)
    is_reviewer = Column(Boolean, default=False)

    # Professional links for scraping
    linkedin_url = Column(String(500), nullable=True)
    github_url = Column(String(500), nullable=True)
    portfolio_url = Column(String(500), nullable=True)
    freelance_url = Column(String(500), nullable=True)
    links_scraped_at = Column(DateTime, nullable=True)

    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    claims = relationship("Claim", back_populates="user", cascade="all, delete-orphan")
    skills = relationship("Skill", back_populates="user", cascade="all, delete-orphan")
    experiences = relationship("Experience", back_populates="user", cascade="all, delete-orphan")
    educations = relationship("Education", back_populates="user", cascade="all, delete-orphan")
    notifications = relationship("Notification", back_populates="user", cascade="all, delete-orphan")
    scraped_profiles = relationship("ScrapedProfile", back_populates="user", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<User {self.name} ({self.lockedin_id})>"
