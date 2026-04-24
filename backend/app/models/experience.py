import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, Date, Boolean, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship

from app.core.database import Base


class Experience(Base):
    __tablename__ = "experiences"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    user_id = Column(String, ForeignKey("users.id"), nullable=False)
    title = Column(String(255), nullable=False)
    company = Column(String(255), nullable=False)
    employment_type = Column(String(50), nullable=True, default="Full-time")
    location = Column(String(255), nullable=True, default="")
    start_date = Column(Date, nullable=True)
    end_date = Column(Date, nullable=True)  # null = Present/Current
    description = Column(Text, nullable=True, default="")
    is_verified = Column(Boolean, default=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    # Relationships
    user = relationship("User", back_populates="experiences")

    def __repr__(self):
        return f"<Experience {self.title} at {self.company}>"
