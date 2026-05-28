from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging
from data_modules.main_models import Base


class MainDatabaseAPI:
    def __init__(self, config):
        try:
            self.engine = create_engine(config.getConnectionString("Main"))
            self.session = sessionmaker(bind=self.engine)
            self.db = self.session()
            Base.metadata.create_all(self.engine)

        except Exception as e:
            logging.error(f"Unable to connect to the database. {e}")
            raise