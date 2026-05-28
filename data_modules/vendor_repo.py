import logging

from sqlalchemy import select


class VendorRepo:
    def __init__(self, session):
        self.session = session

    def add(self, item):
        try:
            self.session.add(item)
            self.session.commit()
            return item
        except Exception as e:
            self.session.rollback()
            logging.error(e)
            return None

    def delete(self, item):
        self.session.delete(item)
        self.session.commit()

    def update(self, model, item):
        self.session.merge(model)
        self.session.commit()

    def get_all(self, model):
        stmt = select(model)
        return self.session.scalars(stmt).all()

    # def get_vendor(self, model, id):
    #     return self.session.get(model, id)

    def get_by_model_id(self, model, id):
        return self.session.get(model, id)

    def get_all_children(self, model, parent_id):
        stmt = self.session.query(model).filter(model.vendor_id == parent_id).all()
        return stmt
