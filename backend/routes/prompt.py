from flask import Blueprint, jsonify, request
import os

get_prompt = Blueprint('get_prompt', __name__)

# Definir las rutas de los archivos de texto para cada capítulo
prompt_files = {
    'Capitulo_1': './prompts/Capitulo_1_prompt.txt',
    'Capitulo_2': './prompts/Capitulo_2_prompt.txt',
    'Capitulo_3': './prompts/Capitulo_3_prompt.txt',
    'Capitulo_4': './prompts/Capitulo_4_prompt.txt',
    'Capitulo_5': './prompts/Capitulo_5_prompt.txt',
    'Capitulo_6': './prompts/Capitulo_6_prompt.txt',
    'Capitulo_7': './prompts/Capitulo_7_prompt.txt'
}

# Cargar todos los prompts al inicio
def load_prompts():
    prompts = {}
    for chapter, file_path in prompt_files.items():
        with open(file_path, 'r', encoding='utf-8') as file:
            prompts[chapter] = file.read()
    return prompts

# Diccionario de prompts cargados
prompts = load_prompts()

@get_prompt.route('/get-prompt', methods=['POST'])
def get_prompt_func():
    try:
        # Recibe el nombre del capítulo a validar
        data = request.json
        chapter = data.get('chapter')

        # Obtener el prompt correspondiente del diccionario
        prompt_content = prompts.get(chapter)

        if prompt_content:
            # Aquí podrías enviar el prompt a la API de ChatPDF
            # y manejar la respuesta según sea necesario.
            return jsonify({'prompt': prompt_content}), 200
        else:
            return jsonify({'error': f'El prompt para {chapter} no se encuentra cargado.'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500