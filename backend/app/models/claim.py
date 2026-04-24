import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Claim(Base):
    __tablename__ = "claims"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    type = Column(String(50), nullable=False)  # "project", "certification", "repository", "achievement"
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True, default="")
    credential_id = Column(String(255), nullable=True)
    external_url = Column(String(500), nullable=True)
    status = Column(String(50), default="pending")  # "pending", "under_review", "verified", "rejected"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="claims")
    evidence = relationship("Evidence", back_populates="claim", cascade="all, delete-orphan")

    def __repr__(self):
        return f"<Claim {self.title} ({self.status})>"
