import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    claim_id = Column(String, ForeignKey("claims.id"), nullable=False)
    type = Column(String(50), nullable=False)  # "document", "url", "email", "screenshot"
    file_url = Column(String(500), nullable=True)  # Cloudinary URL
    external_url = Column(String(500), nullable=True)
    verification_status = Column(String(50), default="pending")
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    claim = relationship("Claim", back_populates="evidence")

    def __repr__(self):
        return f"<Evidence {self.type} ({self.verification_status})>"
