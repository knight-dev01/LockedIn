from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import or_, and_
from typing import List

from app.core.database import get_db
from app.core.security import get_current_user
from app.models.user import User
from app.models.connection import Connection
from app.models.notification import Notification
from app.schemas.claim import ConnectionResponse

router = APIRouter(prefix="/connections", tags=["Network"])


@router.post("/request/{user_id}", response_model=ConnectionResponse, status_code=201)
def send_connection_request(
    user_id: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if current_user.trust_score < 26:
        raise HTTPException(status_code=403, detail="Need Verified Identity (Score 26+) to connect")
    if user_id == current_user.id:
        raise HTTPException(status_code=400, detail="Cannot connect with yourself")
    target = db.query(User).filter(User.id == user_id).first()
    if not target:
        raise HTTPException(status_code=404, detail="User not found")
    existing = db.query(Connection).filter(
        or_(
            and_(Connection.requester_id == current_user.id, Connection.receiver_id == user_id),
            and_(Connection.requester_id == user_id, Connection.receiver_id == current_user.id),
        )
    ).first()
    if existing:
        raise HTTPException(status_code=400, detail="Connection already exists")
    conn = Connection(requester_id=current_user.id, receiver_id=user_id)
    db.add(conn)
    notif = Notification(user_id=user_id, type="connection", title="New Connection Request",
                         message=f"{current_user.name} wants to connect with you.")
    db.add(notif)
    db.commit()
    db.refresh(conn)
    return ConnectionResponse.model_validate(conn)


@router.patch("/{connection_id}/accept", response_model=ConnectionResponse)
def accept_connection(connection_id: str, current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    conn = db.query(Connection).filter(Connection.id == connection_id, Connection.receiver_id == current_user.id, Connection.status == "pending").first()
    if not conn:
        raise HTTPException(status_code=404, detail="Connection request not found")
    conn.status = "accepted"
    notif = Notification(user_id=conn.requester_id, type="connection", title="Connection Accepted",
                         message=f"{current_user.name} accepted your connection request.")
    db.add(notif)
    db.commit()
    db.refresh(conn)
    return ConnectionResponse.model_validate(conn)


@router.get("/my")
def get_my_connections(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    connections = db.query(Connection).filter(
        or_(Connection.requester_id == current_user.id, Connection.receiver_id == current_user.id),
        Connection.status == "accepted",
    ).all()
    result = []
    for conn in connections:
        other_id = conn.receiver_id if conn.requester_id == current_user.id else conn.requester_id
        other = db.query(User).filter(User.id == other_id).first()
        if other:
            result.append({"connection_id": conn.id, "user": {"id": other.id, "name": other.name,
                "lockedin_id": other.lockedin_id, "headline": other.headline or "",
                "profile_image_url": other.profile_image_url or "", "trust_score": other.trust_score}})
    return {"connections": result, "count": len(connections)}
