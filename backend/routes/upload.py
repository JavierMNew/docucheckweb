from flask import Blueprint, request, jsonify
import requests


API_KEY = 'sec_IogpAHJtfhdFFAnZoXd4y1W3BDGmlt84'


upload_document = Blueprint('upload_document', __name__)


@upload_document.route('/upload', methods=['POST'])
def upload_document_func():
    file = request.files['file']
    files = [
        ('file', (file.filename, file.stream, 'application/octet-stream'))
    ]
    headers = {
        'x-api-key': API_KEY
    }
    response = requests.post(
        'https://api.chatpdf.com/v1/sources/add-file', headers=headers, files=files)

    if response.status_code == 200:
        return jsonify({'sourceId': response.json()['sourceId']})
    else:
        return jsonify({'error': response.text}), response.status_code
