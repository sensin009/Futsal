from __future__ import annotations

from sqlalchemy.orm import Session

from app.core.security import get_password_hash
from app.models.enums import UserRole, UserStatus
from app.models.user import User


def ensure_admin(db: Session, email: str, password: str, name: str = "Admin") -> User:
    existing = db.query(User).filter(User.email == email).one_or_none()
    if existing:
        return existing

    admin = User(
        name=name,
        email=email,
        password_hash=get_password_hash(password),
        role=UserRole.admin,
        status=UserStatus.approved,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin

