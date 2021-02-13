from . import db
from .models import Profile, Batch, Stint, Location, Company

from sqlalchemy import and_


def get_user_data(profile_id):
    query = db.session.query(Profile).get(profile_id)
    data = query.serialize()
    return data


def get_graph_data(profile_id):
    # 1. Find all stints the user has participated in
    user_stints = db.session.query(Stint).filter(Stint.profile_id == profile_id).all()

    # 2. For each stint. find all participants/batches that overlap
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
                            ).all()

        # 3. Parse query to determine Recurser nodes and edges
        nodes = _get_recurser_nodes(query)
        edges = _get_recurser_edges(query)

        # 4. Create nodes and edges to represent batches
        batches = set((q.Batch.id, q.Batch.name) for q in query)
        _get_batch_nodes(query, batches, nodes)
        _get_batch_edges(query, batches, edges)

        data = {
            "nodes": nodes,
            "links": edges
        }

        return data


def _get_recurser_nodes(query):
    nodes = []
    for row in query:
        node = {
            "id": row.Profile.id,
            "name": row.Profile.name,
            "profile_path": row.Profile.profile_path,
            "image_path": row.Profile.image_path,
            "location": row.Location.name if row.Location else None,
            "company": row.Company.name if row.Company else None,
            "bio": row.Profile.bio,
            "interests": row.Profile.interests,
            "before_rc": row.Profile.before_rc,
            "during_rc": row.Profile.during_rc,
            "email": row.Profile.email,
            "github": row.Profile.github,
            "twitter": row.Profile.twitter,
            "batch_name": row.Batch.name,
            "batch_short_name": row.Batch.short_name,
            "start_date": row.Batch.short_name,
            "end_date": row.Stint.end_date,
        }
        nodes.append(node)
    return nodes


def _get_recurser_edges(query):
    edges = []
    for row in query:
        edge = {
            "source": row.Profile.id,
            "target": f"B{row.Batch.id}",
            "weight": 1
        }
        edges.append(edge)
    return edges


def _get_batch_nodes(query, batches, nodes):
    for batch in batches:
        node = {
            "id": f"B{batch[0]}",
            "name": batch[1]
        }
        nodes.append(node)
    return nodes


def _get_batch_edges(query, batches, edges):
    for batch1 in batches:
        for batch2 in batches:
            id1 = batch1[0]
            id2 = batch2[0]
            overlap = _get_overlap(id1, id2)
            if overlap > 0:
                edge = {
                    "source": f"B{id1}",
                    "target": f"B{id2}",
                    "weight": overlap,
                }
                edges.append(edge)
    return edges


def _get_overlap(id1, id2):
    return 1  # FIXME: Placeholder return val
    if id1 == id2:
        return 0  # Ignore comparing same batch against itself
    batch1 = id1  # FIXME: Add query to find largest range
    batch2 = id2  # FIXME: Add query to find largest range
    overlap = min(batch1.end_date - batch2.start_date,
                  batch2.end_date - batch1.start_date).days + 1
    return overlap
