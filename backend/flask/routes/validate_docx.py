from flask import Blueprint, request, jsonify
from docx import Document

validate_docx = Blueprint('validate_docx', __name__)

# Diccionario con los títulos requeridos por capítulo
REQUIRED_TITLES_BY_CHAPTER = {
    1: {
        "CAPITULO I. MARCO METODOLOGICO": (14, 'Arial'),
        "Antecedentes y justificación": (12, 'Arial'),
        "Objetivos": (12, 'Arial'),
        "Objetivos específicos": (12, 'Arial'),
        "Alcance": (12, 'Arial'),
        "Metodología": (12, 'Arial')
    },
    2: {
        "CAPITULO II. REVISIÓN BIBLIOGRÁFICA": (14, 'Arial'),
        "Tecnologías web": (12, 'Arial'),
        "Aplicación web": (12, 'Arial'),
        "Usabilidad": (12, 'Arial'),
        "Base de datos": (12, 'Arial'),
        "Modelos de base de datos": (12, 'Arial'),
        "Lenguajes de programación orientada a objetos": (12, 'Arial'),
        "Modelos de desarrollo": (12, 'Arial')
    },
    3: {
        "CAPITULO III. RESULTADOS OBTENIDOS": (14, 'Arial'),
        "Análisis": (12, 'Arial'),
        "Descripción del sistema actual": (12, 'Arial'),
        "Diagrama del proceso del sistema actual": (12, 'Arial'),
        "Detección de problemas y necesidades": (12, 'Arial'),
        "Estudios de factibilidad": (12, 'Arial'),
        "Operativa":(12, 'Arial'),
        "Económica": (12, 'Arial'),
        "Técnicas": (12, 'Arial'),
        "Alternativa de solución": (12, 'Arial'),
        "Nombre de la alternativa": (12, 'Arial'),
        "Descripción de la alternativa": (12, 'Arial'),
        "Mapa de navegación o árbol del sitio": (12, 'Arial'),
        "Justificación": (12, 'Arial'),
        "Tecnologías web a utilizar": (12, 'Arial'),
        "Diseño gráfico de la aplicación": (12, 'Arial')
    },
    4: {
        "CAPITULO IV. CONCLUSIONES": (14, 'Arial')

    }
}

@validate_docx.route('/validate-docx-file/capitulo/<int:capitulo>', methods=['POST'])
def validate_docx_func(capitulo):
    # Verificar si el capítulo está definido
    if capitulo not in REQUIRED_TITLES_BY_CHAPTER:
        return jsonify({'error': f'No hay reglas definidas para el capítulo {capitulo}'}), 400

    # Verificar si el archivo fue enviado
    if 'file' not in request.files:
        return jsonify({'error': 'No se proporcionó un archivo'}), 400

    file = request.files['file']

    # Verificar que el archivo sea un .docx
    if not file.filename.endswith('.docx'):
        return jsonify({'error': 'Formato de archivo no soportado. Se requiere un .docx'}), 400

    document = Document(file)

    required_titles = REQUIRED_TITLES_BY_CHAPTER[capitulo]
    errors = []

    for paragraph in document.paragraphs:
        text = paragraph.text.strip()
        if text in required_titles:
            required_size, required_font = required_titles[text]
            title_valid = False

            for run in paragraph.runs:
                font_name = run.font.name if run.font.name else paragraph.style.font.name
                font_size = run.font.size.pt if run.font.size else (paragraph.style.font.size.pt if paragraph.style.font.size else None)

                if font_name == required_font and font_size == required_size:
                    title_valid = True
                    break

            if not title_valid:
                errors.append(f"Error en '{text}': Debe ser {required_font} {required_size} puntos.")

    if errors:
        return jsonify({'errors': errors, 'capitulo': capitulo}), 400
    else:
        return jsonify({'message': f'El capítulo {capitulo} cumple con los requisitos.'}), 200
