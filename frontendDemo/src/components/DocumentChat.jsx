import React, { useState } from "react";

const ChatInterface = ({ sourceId }) => {
    const [question, setQuestion] = useState("");
    const [answer, setAnswer] = useState("");

    const handleAskQuestion = async () => {
        if (!sourceId) {
            alert("No hay un documento cargado.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5000/ask", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ sourceId, question }),
            });

            const data = await response.json();
            if (response.ok) {
                setAnswer(data.content);
            } else {
                console.error("Error al realizar la pregunta:", data.error);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div>
            <h2>Chat con el Documento</h2>
            <input
                type="text"
                placeholder="Escribe tu pregunta"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
            />
            <button onClick={handleAskQuestion}>Enviar Pregunta</button>

            {answer && (
                <div>
                    <h3>Respuesta:</h3>
                    <p>{answer}</p>
                </div>
            )}
        </div>
    );
};

export default ChatInterface;
