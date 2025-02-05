import React from "react";

const WordViewer = ({ fileUrl }) => {
    return (
        <div>
            <h2>Visor de Documento</h2>
            {fileUrl ? (
                <iframe
                    src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(fileUrl)}`}
                    width="100%"
                    height="600px"
                    title="Visor de Documento"
                ></iframe>
            ) : (
                <p>No hay documento cargado para mostrar.</p>
            )}
        </div>
    );
};

export default WordViewer;
