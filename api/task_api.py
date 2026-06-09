import logging
from datetime import datetime
from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker, scoped_session
from data_modules.task_models import Tasks, Notes, TimeTracking, Base
from data_modules.task_repo import TaskRepo


class TaskDatabaseApi:
    def __init__(self, config):
        try:
            self.engine = create_engine(config.getConnectionString('Tasks'))
            self.session = sessionmaker(bind=self.engine, expire_on_commit=False)
            self.db = scoped_session(self.session)
            Base.metadata.create_all(self.engine)
        except Exception as e:
            logging.error(f"Unable to create database. {e}")
            raise
