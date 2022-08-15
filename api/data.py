import json
import os

from flask import Blueprint, request, jsonify, send_file
from flask_login import current_user
from flask_cors import cross_origin
from sqlalchemy import desc

from . import db
from .models import User
from .models import Patient
from .models import Session

data = Blueprint("data",__name__)

def serialize_sessions(session):
    return {
        'id': session.id,
        'pacient_id': session.patient_id,
        'date': session.date,
        'notes': session.notes,
        'diagnosis': session.diagnosis
    }

def serialize_patients(patient):
    return {
        "label": patient.name,
        "id": patient.id
    }

@data.route('/image_check')
@cross_origin()
def image_check():
    image = User.query.filter_by(id=current_user.id).first().logo_brand

    if image:
        return {'image': True}
    return {'image': None}

@data.route('/show_image')
@cross_origin()
def show_image():
    image = User.query.filter_by(id=current_user.id).first().logo_brand

    if image:
        path = 'logos/' + image
        return send_file(path)
    return {'image': None}

@data.route('/delete_image')
def delete_image():
    os.remove(f'api/logos/{current_user.logo_brand}')

    user = User.query.filter_by(id=current_user.id).first()
    user.logo_brand = None
    db.session.commit()
    return {'deleted': True}


@data.route('/register_patient', methods=['POST'])
@cross_origin()
def register_patient():
    patient = json.loads(request.data)

    new_patient = Patient(medic_id=current_user.id, name=patient['name'], birth_date=patient['birth_date'], age=patient['age'], gender=patient['gender'], address=patient['address'], cpf=patient['cpf'], filiation=patient['filiation'], is_worker=patient['is_worker'], ocupation_place=patient['ocupation_place'], additional_info=patient['additional_info'])
    db.session.add(new_patient)
    db.session.commit()
    return {'id': new_patient.id}

@data.route('/get_patients')
@cross_origin()
def get_patients():
    patients = Patient.query.filter_by(medic_id=current_user.id).all()

    if patients:
        return jsonify([*map(serialize_patients,patients)])
    return {'patients': None}

@data.route('/search_patient', methods=['POST'])
@cross_origin()
def search_patient():
    patient = json.loads(request.data)
    searched_patient = Patient.query.filter_by(id=patient['id']).first()
    return {'patient': {
        'id': searched_patient.id,
        'name': searched_patient.name,
        'birth_date': searched_patient.birth_date,
        'age': searched_patient.age,
        'gender': searched_patient.gender,
        'address': searched_patient.address,
        'cpf': searched_patient.cpf,
        'filiation': searched_patient.filiation,
        'is_worker': searched_patient.is_worker,
        'ocupation_place': searched_patient.ocupation_place,
        'additional_info': searched_patient.additional_info
    }} if searched_patient is not None else {'patient': None}

@data.route('/search_session', methods=['POST'])
@cross_origin()
def search_session():
    patient = json.loads(request.data)
    sessions = Session.query.filter_by(patient_id=patient['id']).order_by(desc(Session.date)).all()

    if sessions:
        return jsonify([*map(serialize_sessions,sessions)])
    return {'sessions': None}

@data.route('/edit_patient', methods=['POST'])
@cross_origin()
def edit_patient():
    patient = json.loads(request.data)
    searched_patient = Patient.query.filter_by(id=patient['id']).first()

    searched_patient.name = patient['new_name']
    searched_patient.birth_date = patient['birth_date']
    searched_patient.age = patient['age']
    searched_patient.gender = patient['gender']
    searched_patient.address = patient['address']
    searched_patient.cpf = patient['cpf']
    searched_patient.filiation = patient['filiation']
    searched_patient.is_worker = patient['is_worker']
    searched_patient.ocupation_place = patient['ocupation_place']
    searched_patient.additional_info = patient['additional_info']
    db.session.commit()

    return {'edited': True}

@data.route('/save_session', methods=['POST'])
def save_session():
    session = json.loads(request.data)
    new_session = Session(patient_id=session['id'], date=session['date'], notes=session['notes'], diagnosis=session['diagnosis'])
    db.session.add(new_session)
    db.session.commit()
    return {'created': True}

@data.route('/display_session', methods=['POST'])
def display_session():
    session = json.loads(request.data)
    searched_session = Session.query.filter_by(id=session['id']).first()

    if searched_session:
        return {'session': {
            'date': searched_session.date,
            'notes': searched_session.notes,
            'diagnosis': searched_session.diagnosis
        }}
    return {'session': None}

@data.route('/erase_session', methods=['POST'])
def erase_session():
    session = json.loads(request.data)
    Session.query.filter_by(id=session['id']).delete()
    db.session.commit()
    return {'erased': True}

@data.route('/edit_session', methods=['POST'])
def edit_session():
    session = json.loads(request.data)
    searched_session = Session.query.filter_by(id=session['id']).first()

    searched_session.date = session['date']
    searched_session.notes = session['notes']
    searched_session.diagnosis = session['diagnosis']
    db.session.commit()

    return {'edited': True}