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
            title_valid = False

            # Validar estilos de los runs
            for run in paragraph.runs:
                font_name = run.font.name if run.font.name else paragraph.style.font.name
                font_size = run.font.size.pt if run.font.size else (paragraph.style.font.size.pt if paragraph.style.font.size else None)

                # Validar si el run cumple con los requisitos
                if font_name == required_font and font_size == required_size:
                    title_valid = True
                    break

            # Si no se encuentra un run válido, registrar el error
            if not title_valid:
                errors.append(f"Error en '{text}': Debe ser {required_font} {required_size} puntos.")

    if errors:
        return jsonify({'errors': errors}), 400
    else:
        return jsonify({'message': 'El documento cumple con los requisitos.'}), 200
