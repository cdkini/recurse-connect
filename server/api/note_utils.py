from . import db
from .models import Note, Tag, Participant

from pprint import pprint

from datetime import datetime


def get_user_notes(profile_id):
    query = db.session.query(
        Note, Tag, Participant
    ).select_from(
        Note
    ).join(
        Tag, Tag.note_id == Note.id, isouter=True
    ).join(
        Participant, Participant.note_id == Note.id, isouter=True
    ).filter(
        Note.author_id == profile_id
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
        if q.Participant and q.Participant.profile_id not in notes[note_id]["participants"]:
            notes[note_id]["participants"].append(q.Participant.profile_id)

    return notes


def post_user_note(data):
    id = db.session.query(Note).count() + 1

    note_entry = Note(
            id=id,
            author_id=data.get("author"),
            title=data.get("title"),
            date=datetime.strptime(data.get("date")[:10], "%Y-%m-%d"),
            content=str(data.get("content"))
    )
    db.session.merge(note_entry)

    participants = data.get("participants")
    _post_note_participants(participants, id)

    tags = data.get("tags")
    _post_note_tags(tags, id)

    db.session.commit()


def _post_note_participants(participants, note_id):
    if not participants:
        return
    for participant in participants:
        participant_entry = Participant(
            profile_id=participant,
            note_id=note_id
        )
        db.session.merge(participant_entry)


def _post_note_tags(tags, note_id):
    if not tags:
        return
    for tag in tags:
        tag_entry = Tag(
            name=tag.lower(),
            note_id=note_id
        )
        db.session.merge(tag_entry)
