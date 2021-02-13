from . import oauth, utils, app
from flask import redirect, url_for, session
import requests
import humps

recurse = oauth.register(
    name="recurse",
    client_id="79966bc856ad6026fda3d298d612afb217618f40546df6e54f5dce3e274d480f",
    client_secret="56bf38a0c4fd2e267abc7ae143f9b40f8b06d4174830421328eef3cc47924b18",
    access_token_url="https://www.recurse.com/oauth/token",
    access_token_params=None,
    authorize_url="https://www.recurse.com/oauth/authorize",
    authorize_params={"redirect_uri": "http://127.0.0.1:5000/api/v1/auth"},
    api_base_url="https://www.recurse.com/api/v1/",
    client_kwargs=None,
)


@app.route("/api/v1/login")
def login():
    recurse = oauth.create_client("recurse")
    redirect_url = url_for("auth")
    a = str(recurse.authorize_redirect(redirect_url).__dict__["response"][0])
    return {"a": a}
    # return recurse.authorize_redirect(redirect_url)


@app.route("/api/v1/logout")
def logout():
    session.pop("access_token", None)
    return redirect("/")


@app.route("/api/v1/auth")
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


@app.route("/api/v1/graph/<profile_id>", methods=["GET"])
def get_graph_data(profile_id):
    data = utils.get_graph_data(profile_id)
    for key in data:
        data[key] = humps.camelize(data[key])
    return data


@app.route("/api/v1/users/<profile_id>", methods=["GET"])
def get_user_data(profile_id):
    data = utils.get_user_data(profile_id)
    humps.camelize(data)
    return data
