import logging
from sqlalchemy import select

class TaskRepo():
    def __init__(self, session):
        self.session = session


    def add(self, item):
        pass

    def update(self, item):
        pass

    def delete(self, item):
        pass

    def get_all(self, model):
        pass

    def get_by_id(self, model, id):
        pass