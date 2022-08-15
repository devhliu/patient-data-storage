from . import db
from flask_login import UserMixin

class User(db.Model,UserMixin):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(255), nullable=False, unique=True)
    logo_brand = db.Column(db.String(255))

class Patient(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    medic_id = db.Column(db.Integer)
    name = db.Column(db.String(255), nullable=False)
    birth_date = db.Column(db.Date)
    age = db.Column(db.Integer)
    gender = db.Column(db.String(255))
    address = db.Column(db.String(255))
    cpf = db.Column(db.String(255))
    filiation = db.Column(db.String(255))
    is_worker = db.Column(db.Boolean)
    ocupation_place = db.Column(db.String(255))
    additional_info = db.Column(db.String(255))

class Session(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    patient_id = db.Column(db.Integer, nullable=False)
    date = db.Column(db.Date, nullable=False)
    notes = db.Column(db.Text, nullable=False)
    diagnosis = db.Column(db.Text)