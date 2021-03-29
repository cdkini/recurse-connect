from . import oauth, graph_utils, note_utils, app
from flask import Response, redirect, url_for, session, request, make_response, jsonify
from flask_cors import cross_origin
import requests
import humps

recurse = oauth.register(
    name="recurse",
    client_id="8ee2901bc1c86bb6a860552cf70ba5ce3ac8c18835697e7e7b2484b430453926",
    client_secret="2b45012b2b3c016f20e4e6b51f72c736704b89803ca4c5e566776a60a018503c",
    access_token_url="https://www.recurse.com/oauth/token",
    access_token_params=None,
    authorize_url="https://www.recurse.com/oauth/authorize",
    authorize_params={"redirect_uri": "urn:ietf:wg:oauth:2.0:oob"},
    api_base_url="https://www.recurse.com/api/v1/",
    client_kwargs=None,
)

payload = {
    "response_type": "code",
    "client_id": "2f247ed93b7f9e9124fcbff7c15d3eb66cc660620ec74d9208731642816677a4",
    "client_secret": "aeab298b746774c290733b2f6ad242bf4d6c2dbe71a36046af43d5dae6d1309f",
    "redirect_uri":  "http://127.0.0.1:5000/api/v1/auth"
}
r = requests.get("https://www.recurse.com/oauth/authorize", params=payload)


@cross_origin()
@app.route("/api/v1/login")
def login():
    response = make_response(response="hello")
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers["Content-Type"] = "application/json"
    response.headers["Accept"] = "application/json"

    return response


@app.route("/api/v1/logout")
def logout():
    session.pop("access_token", None)
    return redirect("/")


@cross_origin()
@app.route("/api/v1/auth")
def auth():
    token = recurse.authorize_access_token()
    print(token)
    access_token = token["access_token"]
    r = requests.get(
        f"https://www.recurse.com/api/v1/profiles/me/?access_token={access_token}"
    )
    r.raise_for_status()
    session["user"] = r.json()["id"]
    # print(session["user"])
    return redirect("/")


@app.route("/api/v1/graph/", methods=["GET"])
@app.route("/api/v1/graph/<profile_id>", methods=["GET"])
def get_graph_data(profile_id=None):
    if not profile_id:
        data = graph_utils.get_all_graph_data()
    else:
        data = graph_utils.get_graph_data(profile_id)
    for key in data:
        data[key] = humps.camelize(data[key])
    return data


@app.route("/api/v1/users/<profile_id>", methods=["GET"])
def get_user_data(profile_id):
    data = graph_utils.get_user_data(profile_id)
    humps.camelize(data)
    return data


@app.route("/api/v1/notes/<profile_id>", methods=["GET"])
def get_user_notes(profile_id):
    data = note_utils.get_user_notes(profile_id)
    return data


@app.route("/api/v1/notes", methods=["POST"])
def post_user_note():
    data = request.json
    note_utils.post_user_note(data)
    return data


@app.route("/api/v1/notes/<profile_id>/<note_id>", methods=["PUT", "DELETE"])
def put_user_note(profile_id, note_id):
    if request.method == "PUT":
        data = request.json
        note_utils.update_user_note(data, profile_id, note_id)
        return data
    if request.method == "DELETE":
        note_utils.delete_user_note(profile_id, note_id)
        return f"Deleted note {note_id} for user {profile_id}"


@app.route("/api/v1/tags", methods=["POST"])
def post_user_tags():
    data = request.json
    note_utils.post_user_tags(data)
    return data
