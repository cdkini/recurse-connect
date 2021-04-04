from . import oauth, graph_utils, note_utils, app
from flask import Response, redirect, url_for, session, request, make_response, jsonify
from flask_cors import cross_origin
import requests
import humps

recurse = oauth.register(
    name="recurse",
    client_id="e54477da9030a8853b454e39d0e957475c7941f6b90dc6b1a30e9ad7a2eaa72c",
    client_secret="4f1ea94bd4b76ad32d2e92ead24764723a0526f68903c1c573d6c05d86a5cb5c",
    access_token_url="https://www.recurse.com/oauth/token",
    access_token_params=None,
    authorize_url="https://www.recurse.com/oauth/authorize",
    authorize_params={"redirect_uri": "http://127.0.0.1:5000/api/v1/auth"},
    api_base_url="https://www.recurse.com/api/v1/",
    client_kwargs=None,
)

# @cross_origin()
# @app.route("/api/v1/login")
# def login():
    # response = make_response(response="hello")
    # response.headers['Access-Control-Allow-Origin'] = '*'
    # response.headers["Content-Type"] = "application/json"
    # response.headers["Accept"] = "application/json"

    # return response

@cross_origin()
@app.route("/api/v1/login")
def login():
    print("hit login")
    recurse = oauth.create_client("recurse")
    redirect_url = url_for("auth")
    return recurse.authorize_redirect(redirect_url)


@cross_origin()
@app.route("/api/v1/auth")
def auth():
    print("hit auth")
    token = recurse.authorize_access_token()
    access_token = token["access_token"]
    r = requests.get(
        f"https://www.recurse.com/api/v1/profiles/me/?access_token={access_token}"
    )
    print(r.json())
    r.raise_for_status()
    session["user"] = r.json()["id"]
    session["access_token"] = access_token 
    return Response(f"Successfully authorized user {session.get('user')}.", 200)


@app.route("/api/v1/logout")
def logout():
    session.pop("user", None)
    session.pop("access_token", None)
    return Response(f"Successfully logged out user {session.get('user')}.", 200)


@app.route("/api/v1/graph/", methods=["GET"])
@app.route("/api/v1/graph/<profile_id>", methods=["GET"])
def get_graph_data(profile_id=None):
    if not session.get("user"):
        return Response(
                "Could not verify your authorization for this resource", 
                401,
                {'WWW-Authenticate': 'Basic realm="Login Required"'},
        )
    if not profile_id:
        data = graph_utils.get_all_graph_data()
    else:
        data = graph_utils.get_graph_data(profile_id)
    for key in data:
        data[key] = humps.camelize(data[key])
    return data


@app.route("/api/v1/users/<profile_id>", methods=["GET"])
def get_user_data(profile_id):
    if not session.get("user"):
        return Response(
                "Could not verify your authorization for this resource", 
                401,
                {'WWW-Authenticate': 'Basic realm="Login Required"'},
        )
    data = graph_utils.get_user_data(profile_id)
    humps.camelize(data)
    return data


@app.route("/api/v1/notes/<profile_id>", methods=["GET"])
def get_user_notes(profile_id):
    if not session.get("user"):
        return Response(
                "Could not verify your authorization for this resource", 
                401,
                {'WWW-Authenticate': 'Basic realm="Login Required"'},
        )
    data = note_utils.get_user_notes(profile_id)
    return data


@app.route("/api/v1/notes", methods=["POST"])
def post_user_note():
    if not session.get("user"):
        return Response(
                "Could not verify your authorization for this resource", 
                401,
                {'WWW-Authenticate': 'Basic realm="Login Required"'},
        )
    data = request.json
    note_utils.post_user_note(data)
    return data


@app.route("/api/v1/notes/<note_id>", methods=["PUT", "DELETE"])
def put_user_note(profile_id, note_id):
    if not session.get("user"):
        return Response(
                "Could not verify your authorization for this resource", 
                401,
                {'WWW-Authenticate': 'Basic realm="Login Required"'},
        )
    if request.method == "PUT":
        data = request.json
        note_utils.update_user_note(data, profile_id, note_id)
        return data
    if request.method == "DELETE":
        note_utils.delete_user_note(profile_id, note_id)
        return f"Deleted note {note_id} for user {profile_id}"


@app.route("/api/v1/tags", methods=["POST"])
def post_user_tags():
    if not session.get("user"):
        return Response(
                "Could not verify your authorization for this resource", 
                401,
                {'WWW-Authenticate': 'Basic realm="Login Required"'},
        )
    data = request.json
    note_utils.post_user_tags(data)
    return data
