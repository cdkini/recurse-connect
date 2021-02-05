from . import models


def get_graph_data(profile_id):
    node_list = []
    edge_list = []

    # Find all user's stints
    stints = [s for s in models.Stint.query.filter(
        models.Stint.profile_id == profile_id).all()]

    for stint in stints:
        # For each stint, find overlapping batches and Recursers
        overlapping_batches = _get_overlapping_batches(stint)
        overlapping_stints = models.Stint.query.filter(
            models.Stint.batch_id.in_(overlapping_batches)).all()
        for stint in overlapping_stints:
            profile = models.Profile.query.filter(models.Profile.id == stint.profile_id).first()
            node = profile.serialize()
            node["batch_id"] = stint.batch_id
            node_list.append(node)
            edge_list.append({
                "source": stint.profile_id,
                "target": stint.batch_id,
                "weight": (stint.end_date - stint.start_date).days
            })

        _create_batch_nodes(overlapping_batches, node_list)
        _create_batch_edges(overlapping_batches, edge_list)

    data = {
        "nodes": node_list,
        "links": edge_list,
    }

    return data


def _get_overlapping_batches(curr):
    batch_ids = set()
    stints = [s for s in models.Stint.query.all()]
    for stint in stints:
        overlap = min(curr.end_date - stint.start_date,
                      stint.end_date - curr.start_date).days + 1
        if overlap > 0:
            batch_ids.add(stint.batch_id)
    return batch_ids


def _create_batch_edges(batches, edge_list):
    for id1 in batches:
        for id2 in batches:
            overlap = _get_overlap(id1, id2)
            if overlap > 0:
                batch_edge = {"source": id1,
                              "target": id2,
                              "weight": overlap,
                              }
                edge_list.append(batch_edge)


def _get_overlap(id1, id2):
    return 1  # FIXME: Placeholder return val
    if id1 == id2:
        return 0  # Ignore comparing same batch against itself
    batch1 = id1  # FIXME: Add query to find largest range
    batch2 = id2  # FIXME: Add query to find largest range
    overlap = min(batch1.end_date - batch2.start_date,
                  batch2.end_date - batch1.start_date).days + 1
    return overlap


def _create_batch_nodes(batches, node_list):
    for batch_id in batches:
        batch_node = {
            "id": batch_id,
            "name": models.Batch.query.filter(models.Batch.id == batch_id).first().name
        }
        node_list.append(batch_node)
