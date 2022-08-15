import os

from flask import request
from flask_login import current_user
from flask_cors import cross_origin
from flask.helpers import send_from_directory
from werkzeug.utils import secure_filename

from api import create_app
from api import db
from api.models import User

app = create_app()

@app.route('/')
@app.route('/login')
@app.route('/home')
@app.route('/create_new_patient')
@app.route('/patient/<int:id>')
@app.route('/edit_patient/<int:id>')
@app.route('/create_session/<int:id>')
@app.route('/patient/<int:patientId>/session/<int:id>')
@app.route('/patient/<int:patientId>/edit_session/<int:id>')
@cross_origin()
def serve(id=None,patientId=None):
    return send_from_directory(app.static_folder, 'index.html')

@app.route('/api/upload_image', methods=['POST'])
@cross_origin()
def upload_data():
    if current_user.logo_brand:
        os.remove(os.path.join(app.config['UPLOAD_FOLDER'], current_user.logo_brand))
    
    image = request.files['file']
    filename = secure_filename(image.filename)
    image.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

    user = User.query.filter_by(id=current_user.id).first()
    user.logo_brand = filename
    db.session.commit()

    return {'file': filename}

if __name__ == '__main__':
    app.run(debug=True)