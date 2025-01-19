from flask import Flask
from flask_cors import CORS
from routes.upload import upload_document
from routes.ask import ask_question
from routes.prompt import get_prompt

app = Flask(__name__)
CORS(app)  # Cambia por tu dominio

# Registrar las rutas
app.register_blueprint(upload_document)
app.register_blueprint(ask_question)
app.register_blueprint(get_prompt)

if __name__ == '__main__':
    app.run(debug=True)
