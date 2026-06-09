from typing import Optional
from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, Text, text, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship

class Base(DeclarativeBase):
    pass

class Tasks(Base):
    __tablename__ = 'tasks'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    title: Mapped[str] = mapped_column(Text, nullable=False)
    create_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=func.now)
    description: Mapped[Optional[str]] = mapped_column(Text)
    followup_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    last_followup: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True, onupdate=datetime.now)
    is_completed: Mapped[Optional[int]] = mapped_column(Integer)

    notes: Mapped[list['Notes']] = relationship('Notes', back_populates='task')
    time_tracking: Mapped[list['TimeTracking']] = relationship('TimeTracking', back_populates='task')

    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'create_date': self.create_date.isoformat() if self.create_date else None,
            'followup_date': self.followup_date.isoformat() if self.followup_date else None,
            'last_followup': self.last_followup.isoformat() if self.last_followup else None,
            'is_completed': self.is_completed
        }


class Notes(Base):
    __tablename__ = 'notes'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    create_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=func.now)
    task_id: Mapped[int] = mapped_column(ForeignKey('tasks.id'), nullable=False)
    note: Mapped[Optional[str]] = mapped_column(Text)

    task: Mapped['Tasks'] = relationship('Tasks', back_populates='notes')

    def to_dict(self):
        return {
            'id': self.id,
            'create_date': self.create_date.isoformat() if self.create_date else None,
            'task_id': self.task_id,
            'note': self.note,
        }

class TimeTracking(Base):
    __tablename__ = 'time_tracking'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    task_id: Mapped[int] = mapped_column(ForeignKey('tasks.id'), nullable=False)
    start_time: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.now)
    end_time: Mapped[Optional[datetime]] = mapped_column(DateTime)

    task: Mapped['Tasks'] = relationship('Tasks', back_populates='time_tracking')

    def to_dict(self):
       return {
            'id': self.id,
            'task_id': self.task_id,
            'start_time': self.start_time.isoformat() if self.start_time else None,
            'end_time': self.end_time.isoformat() if self.end_time else None,
        }