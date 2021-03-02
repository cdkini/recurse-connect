from . import db
from .models import Profile, Batch, Stint, Location, Company

from datetime import datetime

from sqlalchemy import and_


def get_user_data(profile_id):
    query = db.session.query(Profile).get(profile_id)
    data = query.serialize()
    return data


def get_all_graph_data():
    query = db.session.query(
        Profile, Location, Company, Stint, Batch
    ).select_from(
        Profile
    ).join(
        Location, Location.id == Profile.location_id, isouter=True
    ).join(
        Company, Company.id == Profile.company_id, isouter=True
    ).join(
        Stint, Stint.profile_id == Profile.id
    ).join(
        Batch, Batch.id == Stint.batch_id
    ).order_by(
        Stint.start_date
    ).all()

    data = _generate_graph_data(query)
    return data


def get_graph_data(profile_id):
    user_stints = db.session.query(Stint).filter(Stint.profile_id == profile_id).all()

    for user_stint in user_stints:
        query = db.session.query(
            Profile, Location, Company, Stint, Batch
        ).select_from(
            Profile
        ).join(
            Location, Location.id == Profile.location_id, isouter=True
        ).join(
            Company, Company.id == Profile.company_id, isouter=True
        ).join(
            Stint, Stint.profile_id == Profile.id
        ).join(
            Batch, Batch.id == Stint.batch_id
        ).filter(
            and_(user_stint.start_date <= Stint.end_date, user_stint.end_date >= Stint.start_date)
        ).order_by(
            Stint.start_date
        ).all()

        data = _generate_graph_data(query)
        return data


def _generate_graph_data(query):
    recurser_nodes = _get_recurser_nodes(query)
    recurser_edges = _get_recurser_edges(query)

    batch_data = _get_batch_data(query)
    batch_nodes = _get_batch_nodes(query, batch_data)
    batch_edges = _get_batch_edges(query, batch_data)

    nodes = recurser_nodes + batch_nodes
    edges = recurser_edges + batch_edges

    data = {
        "nodes": nodes,
        "links": edges
    }

    return data


def _get_batch_data(query):
    batches = {
        q.Batch.id: {
            "name": q.Batch.name,
            "short_name": q.Batch.short_name,
            "start_date": datetime.max,
            "end_date": datetime.min
        } for q in query}

    for row in query:
        id = row.Batch.id
        start = row.Stint.start_date
        end = row.Stint.end_date
        batches[id]["start_date"] = min(batches[id]["start_date"], start)
        batches[id]["end_date"] = max(batches[id]["end_date"], end)

    return batches


def _get_recurser_nodes(query):
    nodes = []
    seen = set()

    for row in query:
        id = row.Profile.id
        if id in seen:
            continue
        seen.add(id)

        nodes.append({
            "id": id,
            "name": row.Profile.name,
            "profile_path": row.Profile.profile_path,
            "image_path": row.Profile.image_path,
            "location": row.Location.name if row.Location else None,
            "company": row.Company.name if row.Company else None,
            "bio": row.Profile.bio,
            "interests": row.Profile.interests.split(", ") if row.Profile.interests else None,
            "before_rc": row.Profile.before_rc,
            "during_rc": row.Profile.during_rc,
            "email": row.Profile.email,
            "github": row.Profile.github,
            "twitter": row.Profile.twitter,
            "batch_name": row.Batch.name,
            "batch_short_name": row.Batch.short_name,
            "start_date": row.Batch.short_name,
            "end_date": row.Stint.end_date,
        })
    return nodes


def _get_recurser_edges(query):
    edges = []
    for row in query:
        edges.append({
            "source": row.Profile.id,
            "target": f"B{row.Batch.id}",
            "weight": (row.Stint.end_date - row.Stint.start_date).days + 1
        })
    return edges


def _get_batch_nodes(query, batch_data):
    nodes = []
    for id, batch in batch_data.items():
        nodes.append({
            "id": f"B{id}",
            "name": batch["name"],
            "short_name": batch["short_name"],
        })
    return nodes


def _get_batch_edges(query, batch_data):
    edges = []
    for id1, batch1 in batch_data.items():
        for id2, batch2 in batch_data.items():
            if id1 == id2:
                continue
            if overlap := _get_overlap(batch1, batch2) > 0:
                edges.append({
                    "source": f"B{id1}",
                    "target": f"B{id2}",
                    "weight": overlap,
                })
    return edges


def _get_overlap(batch1, batch2):
    return min(batch1["end_date"] - batch2["start_date"], batch2["end_date"] - batch1["start_date"]).days + 1
