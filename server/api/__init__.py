from flask import Flask
from config import Config
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from authlib.integrations.flask_client import OAuth
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config.from_object(Config)
oauth = OAuth(app)
db = SQLAlchemy(app)
migrate = Migrate(app, db)

from api import api, models
