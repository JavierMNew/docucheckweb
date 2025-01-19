from flask import Blueprint, jsonify
import os


get_prompt = Blueprint('get_prompt', __name__)


@get_prompt.route('/get-prompt', methods=['GET'])
def get_prompt_func():
    try:
        prompt_path = './prompt.txt'  # Cambia la ruta si el archivo está en otro lugar
        if os.path.exists(prompt_path):
            with open(prompt_path, 'r') as file:
                prompt = file.read()
            return jsonify({'prompt': prompt}), 200
        else:
            return jsonify({'error': 'El archivo prompt.txt no se encuentra en el servidor.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500
