from sqlalchemy import select


class VendorRepo:
    def __init__(self, session):
        self.session = session

    def add(self, item):
        self.session.add(item)
        self.session.commit()
        return item

    def delete(self, item):
        self.session.delete(item)
        self.session.commit()

    def update(self, model, item):
        self.session.merge(model)
        self.session.commit()

    def get_all(self, model):
        stmt = select(model)
        return self.session.scalars(stmt).all()