from sqlalchemy import Column, Integer

from .Base import db

# Model for Menu Items
class MenuItemModel(db.Model):
    __tablename__ = 'menu_items'

    _id = Column(db.Integer, primary_key=True)
    name = Column(db.String)
    tag = Column(db.String)
