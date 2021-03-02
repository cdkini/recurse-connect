from . import db
from .models import Note, Tag
from sqlalchemy import and_, func

from datetime import datetime


def get_user_notes(profile_id):
    query = db.session.query(
        Note, Tag
    ).select_from(
        Note
    ).join(
        Tag, Tag.note_id == Note.id, isouter=True
    ).filter(
        Note.author == profile_id
    ).all()

    notes = _consolidate_user_notes(query)

    data = {
        "notes": notes
    }

    return data


def _consolidate_user_notes(query):
    notes = {}

    for q in query:
        note_id = q.Note.id
        if note_id not in notes:
            notes[note_id] = {
                "title": q.Note.title,
                "date": q.Note.date,
                "participants": [],
                "tags": [],
                "content": q.Note.content
            }
        if q.Tag and q.Tag.name not in notes[note_id]["tags"]:
            notes[note_id]["tags"].append(q.Tag.name)
        if q.Tag and q.Tag.participant not in notes[note_id]["participants"]:
            notes[note_id]["participants"].append(q.Tag.participant)

    return notes


def post_user_tags(data):
    tags = data.get("tags")
    for tag in tags:
        tag_entry = Tag(
            author=tag.get("author"),
            name=tag.get("name"),
            participant=tag.get("participant"),
            note_id=None
        )
        print(tag_entry)
        db.session.merge(tag_entry)
    db.session.commit()


def post_user_note(data):
    id = db.session.query(func.max(Note.id)).scalar() + 1

    note_entry = Note(
        id=id,
        author=data.get("author"),
        title=data.get("title"),
        date=datetime.strptime(data.get("date")[:10], "%Y-%m-%d"),
        content=data.get("content")
    )
    print(note_entry)
    db.session.merge(note_entry)

    _post_note_tags(data, id)
    db.session.commit()


def _post_note_tags(data, note_id):
    tags = data.get("tags")
    participants = data.get("participants")
    if not tags:
        return

    for tag in tags:
        for participant in participants:
            tag_entry = Tag(
                author=data.get("author"),
                name=tag.lower(),
                participant=participant,
                note_id=note_id
            )
            print(tag_entry)
        db.session.merge(tag_entry)


def update_user_note(data, profile_id, note_id):
    note = db.session.query(Note).filter(and_(Note.id == note_id, Note.author_id == profile_id))
    note.update({
        'title': data.get("title"),
        'date': datetime.strptime(data.get("date")[:10], "%Y-%m-%d"),
        'content': data.get("content")
    })

    _update_note_tags(data, note_id)
    db.session.commit()


def delete_user_note(profile_id, note_id):
    db.session.query(Note).filter(Note.id == note_id).delete()
    db.session.query(Tag).filter(Tag.note_id == note_id).delete()
    db.session.commit()


def _update_note_tags(data, note_id):
    db.session.query(Tag).filter(Tag.note_id == note_id).delete()
    _post_note_tags(data, note_id)
