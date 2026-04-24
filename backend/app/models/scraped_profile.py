import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Integer, DateTime, Text, ForeignKey, JSON
from sqlalchemy.orm import relationship

from app.core.database import Base


class ScrapedProfile(Base):
    __tablename__ = "scraped_profiles"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    platform = Column(String(50), nullable=False)  # "linkedin", "github", "portfolio", "upwork"
    raw_data = Column(JSON, nullable=True)  # Full scraped data
    parsed_data = Column(JSON, nullable=True)  # AI-parsed structured data
    match_score = Column(Integer, default=0)  # How well it matches user claims (0-100)
    scraped_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="scraped_profiles")

    def __repr__(self):
        return f"<ScrapedProfile {self.platform} (match={self.match_score})>"
