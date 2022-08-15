import json

from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager
from flask_cors import CORS

db = SQLAlchemy()
upload_folder = 'api/logos'

def create_app():
    with open('credentials.json','r') as file:
        data = json.load(file)
        secret_key = data['SECRET_KEY']
        database_url = data['DATABASE_URL']

    app = Flask(__name__, static_folder='./../client/build', static_url_path='')

    app.config['SECRET_KEY'] = secret_key
    app.config['SQLALCHEMY_DATABASE_URI'] = database_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
    app.config['UPLOAD_FOLDER'] = upload_folder

    db.init_app(app)
    CORS(app)

    from .models import User

    db.create_all(app=app)

    login_manager = LoginManager()
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(int(user_id))

    from .auth import auth
    from .data import data

    app.register_blueprint(auth,url_prefix='/api')
    app.register_blueprint(data,url_prefix='/api')

    return app