from datetime import datetime
from sqlalchemy import create_engine, inspect
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

    def parse_datetime(self, value) -> datetime | None:
        if value is None:
            return None
        if isinstance(value, datetime):
            return value
        try:
            return datetime.fromisoformat(str(value).replace("Z", "+00:00"))
        except Exception as e:
            raise ValueError(f"Unable to recognize datetime.    {value!r}")

    def add_vendor(self, vendor):
        ''' Add a new vendor to the database.'''
        try:
            new_vendor = Vendors(**vendor)
            for column in inspect(Vendors).mapper.column_attrs:
                if 'date' in column.key:
                    value = getattr(new_vendor, column.key)
                    if value:
                        setattr(new_vendor, column.key, self.parse_datetime(value))

            self.repo.add(new_vendor)
            return new_vendor.to_dict()

        except Exception as e:
            logging.error(f"Unable to add vendor. {e}")
            raise

    def add_contact(self, contact):
        ''' Add a new contact to the database. '''
        try:
            new_contact = Contacts(**contact)
            for column in inspect(Contacts).mapper.column_attrs:
                if 'date' in column.key:
                    value = getattr(new_contact, column.key)
                    if value:
                        setattr(new_contact, column.key, self.parse_datetime(value))

            self.repo.add(new_contact)
            return new_contact.to_dict()
        except Exception as e:
            logging.error(f"Unable to add contact. {e}")
            raise

    def add_comment(self, comment):
        ''' Add a new comment to the database. '''
        try:
            new_comment = Comments(**comment)
            for column in inspect(Comments).mapper.column_attrs:
                if 'date' in column.key:
                    value = getattr(new_comment, column.key)
                    if value:
                        setattr(new_comment, column.key, self.parse_datetime(value))

            saved_comment = self.repo.add(new_comment)
            return new_comment.to_dict()
        except Exception as e:
            logging.error(f"Unable to add comment. {e}")
            raise

    def add_product(self, product):
        ''' Add a new product to the database.'''
        try:
            new_product = Products(**product)
            for column in inspect(Products).mapper.column_attrs:
                if 'date' in column.key:
                    value = getattr(new_product, column.key)
                    if value:
                        setattr(new_product, column.key, self.parse_datetime(value))

            self.repo.add(new_product)
            return new_product.to_dict()
        except Exception as e:
            logging.error(f"Unable to add product. {e}")
            raise

    def add_product_price(self, product_price):
        ''' Add a new product price to the database. '''
        try:
            new_price = ProductPrices(**product_price)
            self.repo.add(new_price)
            return new_price.to_dict()
        except Exception as e:
            logging.error(f"Unable to add product price. {e}")
            raise

    def update_vendor(self, vendor):
        ''' Update Vendor information '''
        try:
            updated_vendor = Vendors(**vendor)
            for column in inspect(Vendors).mapper.column_attrs:
                if 'date' in column.key:
                    value = getattr(updated_vendor, column.key)
                    if value:
                        setattr(updated_vendor, column.key, self.parse_datetime(value))

            self.repo.update(updated_vendor)
            return updated_vendor.to_dict()
        except Exception as e:
            logging.error(f"Unable to update vendor. {e}")
            raise

    def update_contact(self, contact):
        ''' update contact information '''
        try:
            updated_contact = Contacts(**contact)
            for column in inspect(Contacts).mapper.column_attrs:
                if 'date' in column.key:
                    value = getattr(updated_contact, column.key)
                    if value:
                        setattr(updated_contact, column.key, self.parse_datetime(value))

            self.repo.update(updated_contact)
            return updated_contact.to_dict()
        except Exception as e:
            logging.error(f"Unable to update contact. {e}")
            raise

    def update_product(self, product):
        ''' update product information '''
        try:
            updated_product = Products(**product)
            for column in inspect(Products).mapper.column_attrs:
                if 'date' in column.key:
                    value = getattr(updated_product, column.key)
                    if value:
                        setattr(updated_product, column.key, self.parse_datetime(value))

            self.repo.update(updated_product)
            return updated_product.to_dict()
        except Exception as e:
            logging.error(f"Unable to update product. {e}")
            raise

    # Retrieve Vendor information
    def get_vendor(self, vendor_id):
        """ Gets a single vendor by ID. """
        vendor = self.repo.get_by_model_id(Vendors, vendor_id)
        return vendor.to_dict()

    def get_all_vendors(self):
        ''' Gets all vendors and returns dictionaries. '''
        vendors = self.repo.get_all(Vendors)
        return [
            vendor.to_dict() for vendor in vendors
        ]
    # Retrieve Vendor Comments
    def get_vendor_comments(self, vendor_id):
        ''' Gets all comments for a specific vendor. '''
        comments = self.repo.get_all_children(Comments, vendor_id)
        return [
            comment.to_dict() for comment in comments
        ]
    # Retrieves Vendor Contacts
    def get_all_contacts(self, vendorId):
        ''' Gets all contacts for a specific vendor. '''
        contacts = self.repo.get_all_children(Contacts, vendorId)
        return [
            contact.to_dict() for contact in contacts
        ]

    # def get_contact_names(self, name, vendorId):
    #     ''' This revi'''
    #     contacts = self.repo.get_all_children(Contacts, vendorId)
    #     for contact in contacts:
    #         if name == f"{contact.first_name} {contact.last_name}":
    #             return contact.to_dict()

    def get_contact_ById(self, contact_id):
        ''' Gets a contact by ID. '''
        contact = self.repo.get_by_model_id(Contacts, contact_id)
        return contact.to_dict()

    # Retrieves Invoice information
    def get_all_invoices(self):
        return self.repo.get_all(Invoices)

    def get_vendor_invoices(self, vendor_id):
        ''' Gets all invoices for a specific vendor. '''
        invoices = self.repo.get_all_children(Invoices, vendor_id)
        return [invoice.to_dict() for invoice in invoices]

    def add_invoice(self, invoice):
        ''' Add a new invoice to the database. '''
        try:
            new_invoice = Invoices(**invoice)
            for column in inspect(Invoices).mapper.column_attrs:
                if 'date' in column.key:
                    value = getattr(new_invoice, column.key)
                    if value:
                        setattr(new_invoice, column.key, self.parse_datetime(value))
            self.repo.add(new_invoice)
            return new_invoice.to_dict()
        except Exception as e:
            logging.error(f"Unable to add invoice. {e}")
            raise

    def update_invoice(self, invoice):
        ''' Update invoice information. '''
        try:
            updated_invoice = Invoices(**invoice)
            for column in inspect(Invoices).mapper.column_attrs:
                if 'date' in column.key:
                    value = getattr(updated_invoice, column.key)
                    if value:
                        setattr(updated_invoice, column.key, self.parse_datetime(value))
            self.repo.update(updated_invoice)
            return updated_invoice.to_dict()
        except Exception as e:
            logging.error(f"Unable to update invoice. {e}")
            raise

    # Retrieves Product Information
    def get_all_products(self, vendorId):
        ''' Gets all products for a specific vendor. '''
        products =  self.repo.get_all_children(Products, vendorId)
        return [
            product.to_dict() for product in products
        ]

    # Retrieves Product Prices
    def get_product_price(self, productId):
        ''' Gets the current price of a specific product. '''
        prices = self.repo.get_all_product_children(ProductPrices, productId)
        for price in prices:
            if price.is_active:
                return price.to_dict()
