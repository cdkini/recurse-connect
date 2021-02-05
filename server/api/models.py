from . import db
from sqlalchemy.inspection import inspect

from sqlalchemy import or_


class Serializer(object):

    def serialize(self):
        return {obj: getattr(self, obj) for obj in inspect(self).attrs.keys()}

    @staticmethod
    def serialize_list(obj_list):
        return [obj.serialize() for obj in obj_list]


class Profile(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    profile_path = db.Column(db.String(128))
    image_path = db.Column(db.String(256))
    interests = db.Column(db.String(256))
    location_id = db.Column(db.Integer, db.ForeignKey("location.id"))
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"))

    def __repr__(self):
        return str(self.__dict__)


class Location(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))

    def __repr__(self):
        return str(self.__dict__)


class Batch(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    short_name = db.Column(db.String(64))

    def __repr__(self):
        return str(self.__dict__)


class Stint(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True)
    start_date = db.Column(db.DateTime)
    end_date = db.Column(db.DateTime)
    batch_id = db.Column(db.Integer, db.ForeignKey("batch.id"))
    profile_id = db.Column(db.Integer, db.ForeignKey("profile.id"))

    def __repr__(self):
        return str(self.__dict__)


class Company(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))

    def __repr__(self):
        return str(self.__dict__)