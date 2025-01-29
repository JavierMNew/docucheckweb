from flask import Flask
from flask_cors import CORS
from routes.upload import upload_document
from routes.ask import ask_question
from routes.prompt import get_prompt
from routes.validate_docx import validate_docx # Importa el nuevo blueprint


app = Flask(__name__)
CORS(app)  

#rutas
app.register_blueprint(upload_document)
app.register_blueprint(ask_question)
app.register_blueprint(get_prompt)
app.register_blueprint(validate_docx) # Registra el nuevo blueprint


if __name__ == '__main__':
    app.run(debug=True)
