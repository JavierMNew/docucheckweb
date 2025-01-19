import requests


API_KEY = 'sec_IogpAHJtfhdFFAnZoXd4y1W3BDGmlt84'

def upload_document_to_chatpdf(file):
    files = [
        ('file', (file.filename, file.stream, 'application/octet-stream'))
    ]
    headers = {
        'x-api-key': API_KEY
    }
    response = requests.post(
        'https://api.chatpdf.com/v1/sources/add-file', headers=headers, files=files)
    return response

def ask_question_to_chatpdf(source_id, question):
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
    return response
