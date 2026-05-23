from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import logging
from data_modules.vendor_models import Base, Vendors, Contacts, Invoices, Products
from data_modules.vendor_repo import VendorRepo


class VendorDatabaseAPI:
    def __init__(self, config):
        try:
            self.engine = create_engine(config.getConnectionString("Vendor Database"))
            self.session = sessionmaker(bind=self.engine)
            self.db = self.session()
            Base.metadata.create_all(self.engine)

        except Exception as e:
            logging.error(f"Unable to connect to the database. {e}")
            raise

        self.repo = VendorRepo(self.db)

    def add_vendor(self, vendor):
        try:
            new_vendor = Vendors(**vendor)
            saved_vendor = self.repo.add(new_vendor)
            return saved_vendor.to_dict()

        except Exception as e:
            logging.error(f"Unable to add vendor. {e}")
            raise

    def get_all_vendors(self):
        vendors = self.repo.get_all(Vendors)
        print(vendors)
        return [
            vendor.to_dict() for vendor in vendors
        ]

    def get_all_contacts(self):
        return self.repo.get_all(Contacts)

    def get_all_invoices(self):
        return self.repo.get_all(Invoices)

    def get_all_products(self):
        return self.repo.get_all(Products)