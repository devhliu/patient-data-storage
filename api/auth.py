import json
import re

from flask import Blueprint, request
from flask_login import login_user, current_user
from flask_cors import cross_origin
from werkzeug.security import generate_password_hash,check_password_hash

from . import db
from .models import User

auth = Blueprint("auth",__name__)

@auth.route('/register', methods=['POST'])
@cross_origin()
def register():
    auth_values = json.loads(request.data)
    username = auth_values['username']
    password1 = auth_values['password1']
    password2 = auth_values['password2']

    if password1 != password2:
        return {'auth': False}
    if re.search('[0-9]',password1) is None or re.search('[a-z]',password1) is None:
        return {'auth': False}

    hashed_password = generate_password_hash(password1,method='sha256')
    new_user = User(username=username,password=hashed_password,logo_brand=None)
    db.session.add(new_user)
    db.session.commit()
    return {'auth': True}

@auth.route('/login', methods=['POST'])
@cross_origin()
def login():
    auth_values = json.loads(request.data)
    username = auth_values['username']
    password = auth_values['password']
    user = User.query.filter_by(username=username).first()

    if user:
        if check_password_hash(user.password,password):
            login_user(user,remember=True)
            return {'auth': True}
        else:
            return {'auth': False}
    return {'auth': False}

@auth.route('/is_logged')
@cross_origin()
def is_logged():
    return {'auth': current_user.is_authenticated}