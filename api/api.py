from . import app, oauth, graph
from flask import redirect, url_for, session
import requests


recurse = oauth.register(
    name="recurse",
    client_id="ee04d128f4f36993d81b37feb6fd5a0a21fa5a8e0fdfa940f50b1aa9a109f778",
    client_secret="28a08d792884534822f311ae332806b09dfb610c9536d0c72b46692e4fc9dd12",
    access_token_url="https://www.recurse.com/oauth/token",
    access_token_params=None,
    authorize_url="https://www.recurse.com/oauth/authorize",
    authorize_params={"redirect_uri": "http://127.0.0.1:3000/auth"},
    api_base_url="https://www.recurse.com/api/v1/",
    client_kwargs=None,
)


@app.route("/test")
def test():
    return {"test": "this is a test!"}


@app.route("/login")
def login():
    recurse = oauth.create_client("recurse")
    redirect_url = url_for("auth", _external=True)
    return recurse.authorize_redirect(redirect_url)


@app.route("/logout")
def logout():
    session.pop("access_token", None)
    return redirect("/")


@app.route("/auth")
def auth():
    recurse = oauth.create_client("recurse")
    token = recurse.authorize_access_token()
    print(token)
    access_token = token["access_token"]
    r = requests.get(
        f"https://www.recurse.com/api/v1/profiles/me/?access_token={access_token}"
    )
    r.raise_for_status()
    session["user"] = r.json()["id"]
    print(session["user"])
    return redirect("/")


@app.route("/api/graph/<profile_id>", methods=["GET"])
def api_graph(profile_id):
    data = graph.get_graph_data(profile_id)
    return data
