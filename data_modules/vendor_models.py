from typing import Optional
from datetime import datetime

from sqlalchemy import CheckConstraint, Column, Date, DateTime, ForeignKey, Integer, REAL, Table, Text, text
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column, relationship
from sqlalchemy.sql.operators import not_between_op


class Base(DeclarativeBase):
    pass


class Vendors(Base):
    __tablename__ = 'vendors'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    create_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now)
    name: Mapped[Optional[str]] = mapped_column(Text)
    address1: Mapped[Optional[str]] = mapped_column(Text)
    address2: Mapped[Optional[str]] = mapped_column(Text)
    city: Mapped[Optional[str]] = mapped_column(Text)
    state: Mapped[Optional[str]] = mapped_column(Text)
    zip: Mapped[Optional[str]] = mapped_column(Text)
    country: Mapped[Optional[str]] = mapped_column(Text)
    website: Mapped[Optional[str]] = mapped_column(Text)
    modify_date: Mapped[Optional[datetime]] = mapped_column(DateTime)

    contacts: Mapped[list['Contacts']] = relationship('Contacts', back_populates='vendor')
    invoices: Mapped[list['Invoices']] = relationship('Invoices', back_populates='vendor')
    products: Mapped[list['Products']] = relationship('Products', back_populates='vendor')
    comments: Mapped[list['Comments']] = relationship('Comments', back_populates='vendor')

    def to_dict(self):
        return {
            'id': self.id,
            'create_date': str(self.create_date.date()),
            'name': self.name,
            'address1': self.address1,
            'address2': self.address2,
            'city': self.city,
            'state': self.state,
            'zip': self.zip,
            'country': self.country,
            'website': self.website,
            'modify_date': str(self.modify_date),
        }

class Contacts(Base):
    __tablename__ = 'contacts'
    __table_args__ = (
        CheckConstraint('is_active in(0,1)'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    vendor_id: Mapped[int] = mapped_column(ForeignKey('vendors.id'), nullable=False)
    create_date: Mapped[datetime] = mapped_column(DateTime, nullable=False, default=datetime.now)
    first_name: Mapped[Optional[str]] = mapped_column(Text)
    last_name: Mapped[Optional[str]] = mapped_column(Text)
    phone: Mapped[Optional[str]] = mapped_column(Text)
    email: Mapped[Optional[str]] = mapped_column(Text)
    title: Mapped[Optional[str]] = mapped_column(Text)
    is_active: Mapped[Optional[int]] = mapped_column(Integer, server_default=text('0'))
    modify_date: Mapped[Optional[datetime]] = mapped_column(DateTime)

    vendor: Mapped['Vendors'] = relationship('Vendors', back_populates='contacts')
    comments: Mapped[list['Comments']] = relationship('Comments', back_populates='contact')

    def to_dict(self):
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'create_date': str(self.create_date.date()),
            'first_name': self.first_name,
            'last_name': self.last_name,
            'phone': self.phone,
            'email': self.email,
            'title': self.title,
            'is_active': self.is_active,
            'modify_date': str(self.modify_date.date())
        }

class Invoices(Base):
    __tablename__ = 'invoices'

    id: Mapped[int] = mapped_column(Integer, primary_key=True, unique=True)
    vendor_id: Mapped[int] = mapped_column(ForeignKey('vendors.id'), nullable=False)
    invoice_number: Mapped[Optional[str]] = mapped_column(Text)
    received_date: Mapped[Optional[datetime]] = mapped_column(Date)
    due_date: Mapped[Optional[datetime]] = mapped_column(Date)
    invoice_total: Mapped[Optional[float]] = mapped_column(REAL)

    vendor: Mapped['Vendors'] = relationship('Vendors', back_populates='invoices')

    def to_dict(self):
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'invoice_number': self.invoice_number,
            'received_date': str(self.received_date),
            'due_date': str(self.due_date),
            'invoice_total': self.invoice_total,
        }
class Products(Base):
    __tablename__ = 'products'
    __table_args__ = (
        CheckConstraint('is_used in(0,1)'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True, unique=True)
    vendor_id: Mapped[int] = mapped_column(ForeignKey('vendors.id'), nullable=False)
    item_number: Mapped[Optional[str]] = mapped_column(Text)
    name: Mapped[Optional[str]] = mapped_column(Text)
    description: Mapped[Optional[str]] = mapped_column(Text)
    model: Mapped[Optional[str]] = mapped_column(Text)
    serial: Mapped[Optional[str]] = mapped_column(Text)
    service_level: Mapped[Optional[str]] = mapped_column(Text)
    create_date: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.now)
    update_date: Mapped[Optional[datetime]] = mapped_column(DateTime)
    is_used: Mapped[Optional[int]] = mapped_column(Integer, server_default=text('0'))

    vendor: Mapped['Vendors'] = relationship('Vendors', back_populates='products')
    product_prices: Mapped[list['ProductPrices']] = relationship('ProductPrices', back_populates='product')

    def to_dict(self):
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'item_number': self.item_number,
            'name': self.name,
            'description': self.description,
            'model': self.model,
            'serial': self.serial,
            'service_level': self.service_level,
            'create_date': str(self.create_date.date()),
            'update_date': str(self.update_date.date()),
            'is_used': self.is_used,
        }

class Comments(Base):
    __tablename__ = 'comments'

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    contact_id: Mapped[int] = mapped_column(ForeignKey('contacts.id'), nullable=False)
    vendor_id: Mapped[int] = mapped_column(ForeignKey('vendors.id'), nullable=False)
    comment: Mapped[Optional[str]] = mapped_column(Text)
    create_date: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.now)

    contact: Mapped['Contacts'] = relationship('Contacts', back_populates='comments')
    vendor: Mapped['Vendors'] = relationship('Vendors', back_populates='comments')

    def to_dict(self):
        return {
            'id': self.id,
            'vendor_id': self.vendor_id,
            'contact_id': self.contact_id,
            'comment': self.comment,
            'create_date': str(self.create_date.date()),
        }
t_invoice_products = Table(
    'invoice_products', Base.metadata,
    Column('product_id', ForeignKey('products.id'), nullable=False),
    Column('invoice_id', ForeignKey('invoices.id'), nullable=False),
    Column('quantity', Integer, nullable=False),
    Column('period_start', Date),
    Column('period_end', Date)
)


class ProductPrices(Base):
    __tablename__ = 'product_prices'
    __table_args__ = (
        CheckConstraint('is_active IN (0,1)'),
    )

    id: Mapped[int] = mapped_column(Integer, primary_key=True)
    product_id: Mapped[int] = mapped_column(ForeignKey('products.id'), nullable=False)
    price: Mapped[Optional[int]] = mapped_column(Integer)
    is_active: Mapped[Optional[int]] = mapped_column(Integer)
    create_date: Mapped[Optional[datetime]] = mapped_column(DateTime, default=datetime.now)
    update_date: Mapped[Optional[datetime]] = mapped_column(DateTime)

    product: Mapped['Products'] = relationship('Products', back_populates='product_prices')

    def to_dict(self):
        return {
            'id': self.id,
            'product_id': self.product_id,
            'price': self.price,
            'is_active': self.is_active,
            'create_date': str(self.create_date.date()),
            'update_date': str(self.update_date.date()),
        }