from . import db
from sqlalchemy.inspection import inspect


class Serializer(object):
    @staticmethod
    def serialize_list(obj_list):
        return [obj.serialize() for obj in obj_list]

    def serialize(self):
        return {
            self._to_camel_case(obj): getattr(self, obj)
            for obj in inspect(self).attrs.keys()
        }

    def _to_camel_case(self, snake_str):
        components = snake_str.split('_')
        return components[0] + ''.join(x.title() for x in components[1:])


class Profile(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(64))
    profile_path = db.Column(db.String(128))
    image_path = db.Column(db.String(256))
    location_id = db.Column(db.Integer, db.ForeignKey("location.id"))
    company_id = db.Column(db.Integer, db.ForeignKey("company.id"))
    bio = db.Column(db.String(1024))
    interests = db.Column(db.String(512))
    before_rc = db.Column(db.String(512))
    during_rc = db.Column(db.String(512))
    email = db.Column(db.String(64))
    github = db.Column(db.String(64))
    twitter = db.Column(db.String(64))

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


class Note(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.Integer, db.ForeignKey("profile.id"))
    title = db.Column(db.String(128))
    date = db.Column(db.String(128))
    content = db.Column(db.JSON)

    def __repr__(self):
        return str(self.__dict__)


# What tags are associated with a given note? Who is associated with a tag?
class Tag(db.Model, Serializer):
    id = db.Column(db.Integer, primary_key=True)
    author = db.Column(db.Integer, db.ForeignKey("profile.id"))
    name = db.Column(db.String(64))
    participant = db.Column(db.Integer, db.ForeignKey("profile.id"))
    note_id = db.Column(db.Integer, db.ForeignKey("note.id"))

    def __repr__(self):
        return str(self.__dict__)


# Which Recursers are associated with a given note?
# class Participant(db.Model, Serializer):
#     id = db.Column(db.Integer, primary_key=True)
#     profile_id = db.Column(db.Integer, db.ForeignKey("profile.id"))
#     note_id = db.Column(db.Integer, db.ForeignKey("note.id"))

#     def __repr__(self):
#         return str(self.__dict__)
