import React, { useState } from "react";

const FileUploader = ({ setSourceId }) => {
    const [file, setFile] = useState(null);

    const handleFileChange = (event) => {
        setFile(event.target.files[0]);
    };

    const handleFileUpload = async () => {
        if (!file) {
            alert("Por favor selecciona un archivo");
            return;
        }

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("http://localhost:5000/upload", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();
            if (response.ok) {
                setSourceId(data.sourceId);
                alert("Archivo subido correctamente.");
            } else {
                console.error("Error al subir el archivo:", data.error);
            }
        } catch (err) {
            console.error("Error:", err);
        }
    };

    return (
        <div>
            <h2>Subir Documento</h2>
            <input type="file" onChange={handleFileChange} />
            <button onClick={handleFileUpload}>Subir Archivo</button>
        </div>
    );
};

export default FileUploader;
