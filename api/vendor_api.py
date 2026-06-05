from datetime import datetime

from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, scoped_session
import logging
from data_modules.vendor_models import Base, Vendors, Contacts, Invoices, Products, Comments, ProductPrices
from data_modules.vendor_repo import VendorRepo


class VendorDatabaseAPI:
    def __init__(self, config):
        try:
            self.engine = create_engine(config.getConnectionString("Vendors"))
            self.session = sessionmaker(bind=self.engine, expire_on_commit=False)
            self.db = scoped_session(self.session)
            Base.metadata.create_all(self.engine)

        except Exception as e:
            logging.error(f"Unable to connect to the database. {e}")
            raise

        self.repo = VendorRepo(self.db)

    def add_vendor(self, vendor):
        try:
            new_vendor = Vendors(**vendor)
            self.repo.add(new_vendor)
            return new_vendor.to_dict()

        except Exception as e:
            logging.error(f"Unable to add vendor. {e}")
            raise

    def add_contact(self, contact):
        try:
            new_contact = Contacts(**contact)
            saved_contact = self.repo.add(new_contact)
            return new_contact.to_dict()
        except Exception as e:
            logging.error(f"Unable to add contact. {e}")
            raise

    def add_comment(self, comment):
        try:
            new_comment = Comments(**comment)
            saved_comment = self.repo.add(new_comment)
            return saved_comment.to_dict()
        except Exception as e:
            logging.error(f"Unable to add comment. {e}")
            raise

    def add_product(self, product):
        try:
            new_product = Products(**product)
            saved_product = self.repo.add(new_product)
            print(new_product.id)
            return new_product.to_dict()
        except Exception as e:
            logging.error(f"Unable to add product. {e}")
            raise

    def add_product_price(self, product_price):
        try:
            new_price = ProductPrices(**product_price)

            saved_price = self.repo.add(new_price)
            return saved_price.to_dict()
        except Exception as e:
            logging.error(f"Unable to add product price. {e}")
            raise

    def update_vendor(self, vendor):
        try:

            updated_vendor = Vendors(**vendor)
            updated_vendor.create_date = datetime.fromisoformat(updated_vendor.create_date.replace("Z", "+00:00"))
            updated_vendor.modify_date = datetime.now()
            vendor = self.repo.update(updated_vendor)
            print(updated_vendor.modify_date)
            return updated_vendor.to_dict()
        except Exception as e:
            logging.error(f"Unable to update vendor. {e}")
            raise

    def update_contact(self, contact):
        try:
            updated_contact = Contacts(**contact)
            updated_contact.create_date = datetime.fromisoformat(updated_contact.create_date.replace("Z", "+00:00"))
            updated_contact.modify_date = datetime.now()
            contact = self.repo.update(updated_contact)
            return updated_contact.to_dict()
        except Exception as e:
            logging.error(f"Unable to update contact. {e}")
            raise

    def update_product(self, product):
        try:
            updated_product = Products(**product)
            updated_product.create_date = datetime.fromisoformat(updated_product.create_date.replace("Z", "+00:00"))
            updated_product.update_date = datetime.fromisoformat(updated_product.update_date.replace("Z", "+00:00"))
            contact = self.repo.update(updated_product)
            return updated_product.to_dict()
        except Exception as e:
            logging.error(f"Unable to update product. {e}")
            raise

    def get_vendor(self, vendor_id):
        vendor = self.repo.get_by_model_id(Vendors, vendor_id)
        return vendor.to_dict()

    def get_all_vendors(self):
        vendors = self.repo.get_all(Vendors)
        return [
            vendor.to_dict() for vendor in vendors
        ]

    def get_vendor_comments(self, vendor_id):
        comments = self.repo.get_all_children(Comments, vendor_id)
        return [
            comment.to_dict() for comment in comments
        ]
    def get_all_contacts(self, vendorId):
        contacts = self.repo.get_all_children(Contacts, vendorId)
        return [
            contact.to_dict() for contact in contacts
        ]
    def get_contact(self, name, vendorId):
        contacts = self.repo.get_all_children(Contacts, vendorId)
        for contact in contacts:
            if name == f"{contact.first_name} {contact.last_name}":
                return contact.to_dict()

    def get_contact_ById(self, contact_id):
        contact = self.repo.get_by_model_id(Contacts, contact_id)
        return contact.to_dict()
    def get_all_invoices(self):
        return self.repo.get_all(Invoices)

    def get_all_products(self, vendorId):
        products =  self.repo.get_all_children(Products, vendorId)
        return [
            product.to_dict() for product in products
        ]

    def get_product_price(self, productId):
        prices = self.repo.get_all_product_children(ProductPrices, productId)
        for price in prices:
            print(price.to_dict())
            print(price.price)
            if price.is_active:

                return price.to_dict()

    def get_contact_by_id(self, contact_id):
        contact = self.repo.get_by_model_id(Contacts, contact_id)
        return contact.to_dict()