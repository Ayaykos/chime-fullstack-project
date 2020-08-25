from sqlalchemy import Column, Integer

from .Base import db

# Model for Menu Item Tags
class TagModel(db.Model):
    __tablename__ = 'tags'

    _id = Column(db.Integer, primary_key=True)
    name = Column(db.String)
