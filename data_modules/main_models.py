from typing import Optional
import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, Text, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass


class Division(Base):
    __tablename__ = 'division'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    url: Mapped[Optional[str]] = mapped_column(Text)
    create_date: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    modified_date: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    user_divisions: Mapped[list['UserDivisions']] = relationship('UserDivisions', back_populates='division')


class Roles(Base):
    __tablename__ = 'roles'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    create_date: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    modified_date: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)

    permissions: Mapped[list['Permissions']] = relationship('Permissions', back_populates='role')


class Users(Base):
    __tablename__ = 'users'
    __table_args__ = (
        CheckConstraint('is_active IN(0,1)'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, unique=True)
    firstName: Mapped[str] = mapped_column(Text, nullable=False)
    lastName: Mapped[str] = mapped_column(Text, nullable=False)
    username: Mapped[Optional[str]] = mapped_column(Text)
    password: Mapped[Optional[str]] = mapped_column(Text)
    email: Mapped[Optional[str]] = mapped_column(Text)
    phone: Mapped[Optional[str]] = mapped_column(Text)
    is_active: Mapped[Optional[int]] = mapped_column(Integer, server_default=text('0'))
    create_date: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))
    modified_date: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime)
    role: Mapped[Optional[str]] = mapped_column(Text, server_default=text('standard'))

    user_divisions: Mapped[list['UserDivisions']] = relationship('UserDivisions', back_populates='user')


class Permissions(Base):
    __tablename__ = 'permissions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    name: Mapped[str] = mapped_column(Text, nullable=False)
    role_id: Mapped[int] = mapped_column(ForeignKey('roles.id'), nullable=False)
    create_date: Mapped[Optional[datetime.datetime]] = mapped_column(DateTime, server_default=text('CURRENT_TIMESTAMP'))

    role: Mapped['Roles'] = relationship('Roles', back_populates='permissions')


class UserDivisions(Base):
    __tablename__ = 'user_divisions'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    user_id: Mapped[int] = mapped_column(ForeignKey('users.id'), nullable=False)
    division_id: Mapped[int] = mapped_column(ForeignKey('division.id'), nullable=False)

    division: Mapped['Division'] = relationship('Division', back_populates='user_divisions')
    user: Mapped['Users'] = relationship('Users', back_populates='user_divisions')
