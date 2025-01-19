from flask import Blueprint, request, jsonify
import requests


API_KEY = 'sec_IogpAHJtfhdFFAnZoXd4y1W3BDGmlt84'


ask_question = Blueprint('ask_question', __name__)


@ask_question.route('/ask', methods=['POST'])
def ask_question_func():
    data = request.json
    source_id = data['sourceId']
    question = data['question']

    url = 'https://api.chatpdf.com/v1/chats/message'
    headers = {
        'x-api-key': API_KEY,
        'Content-Type': 'application/json',
    }
    data = {
        'sourceId': source_id,
        'messages': [
            {
                'role': 'user',
                'content': question,
            }
        ]
    }
    response = requests.post(url, headers=headers, json=data)

    if response.status_code == 200:
        return jsonify({'content': response.json()['content']})
    else:
        return jsonify({'error': response.text}), response.status_code
