import uuid
from datetime import datetime, timezone

from sqlalchemy import Column, String, DateTime, ForeignKey

from app.core.database import Base


class Connection(Base):
    __tablename__ = "connections"

    id = Column(String, primary_key=True, default=lambda: str(uuid.uuid4()))
    requester_id = Column(String, ForeignKey("users.id"), nullable=False)
    receiver_id = Column(String, ForeignKey("users.id"), nullable=False)
    status = Column(String(50), default="pending")  # "pending", "accepted", "rejected"
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))

    def __repr__(self):
        return f"<Connection {self.requester_id} -> {self.receiver_id} ({self.status})>"
