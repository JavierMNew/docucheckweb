from flask import Blueprint, request, jsonify
from docx import Document

validate_docx = Blueprint('validate_docx', __name__)

@validate_docx.route('/validate-docx-file', methods=['POST'])
def validate_docx_func():
    file = request.files['file']
    document = Document(file)

    # Definición de los títulos y sus requisitos
    required_titles = {
        "CAPITULO I. MARCO METODOLOGICO": (14, 'Arial'),
        "Antecedentes y justificación": (12, 'Arial'),
        "Objetivos": (12, 'Arial'),
        "Objetivos específicos": (12, 'Arial'),
        "Alcance": (12, 'Arial'),
        "Metodología": (12, 'Arial')
    }

    errors = []

    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if text in required_titles:
            required_size, required_font = required_titles[text]
            style = paragraph.style
            font = style.font

            # Verificar fuente y tamaño
            if font.name != required_font or font.size.pt != required_size:
                errors.append(f"Error en '{text}': Debe ser {required_font} {required_size}")

    if errors:
        return jsonify({'errors': errors}), 400
    else:
        return jsonify({'message': 'El documento cumple con los requisitos.'}), 200