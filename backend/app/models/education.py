import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Date, Boolean, DateTime, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Education(Base):
    __tablename__ = "educations"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    institution = Column(String(255), nullable=False)
    degree = Column(String(255), nullable=True, default="")
    field_of_study = Column(String(255), nullable=True, default="")
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="educations")

    def __repr__(self):
        return f"<Education {self.degree} at {self.institution}>"
