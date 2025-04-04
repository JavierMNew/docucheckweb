import React, { useState, useEffect } from "react";
import "./App.css";
import Login from "./components/Login";
import Register from "./components/Register";
import Header from "./components/Header";
import Footer from "./components/Footer";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [file, setFile] = useState(null);
  const [sourceId, setSourceId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [response, setResponse] = useState(null);
  const [errors, setErrors] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1); // Estado para el capítulo actual
  const [isLoading, setIsLoading] = useState(false);
  const [freeQuestion, setFreeQuestion] = useState("");
  const [freeQuestionLoading, setFreeQuestionLoading] = useState(false);

  // Cargar el prompt del capítulo actual desde el backend
  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const res = await fetch("http://localhost:5000/get-prompt", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ chapter: `Capitulo_${currentChapter}` }),
        });
        const data = await res.json();
        if (res.ok) {
          setPrompt(data.prompt);
        } else {
          console.error("Error fetching prompt:", data.error);
        }
      } catch (error) {
        console.error("Error loading the prompt:", error);
      }
    };
    loadPrompt();
  }, [currentChapter]); // Recargar el prompt cuando cambie el capítulo actual

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("http://localhost:3000/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSourceId(data.sourceId);
        setPdfUrl(URL.createObjectURL(file)); // Crear una URL para visualizar el archivo PDF
      } else {
        console.error("Error uploading the document:", data.error);
      }
    } catch (error) {
      console.error("Error uploading the document:", error);
    }
  };

  const handleAskQuestion = async () => {
    if (!prompt) {
      console.error("Prompt not loaded yet.");
      return;
    }

    setIsLoading(true); // Activar loading
    try {
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ sourceId: sourceId, question: prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data.content);
        setErrors(extractErrors(data.content));
        setShowModal(true);
      } else {
        console.error("Error asking the question:", data.error);
      }
    } catch (error) {
      console.error("Error asking the question:", error);
    } finally {
      setIsLoading(false); // Desactivar loading
    }
  };

  const handleFreeQuestion = async () => {
    if (!freeQuestion.trim()) {
      return;
    }

    setFreeQuestionLoading(true);
    try {
      // Primero obtener el contexto del capítulo actual
      const promptRes = await fetch("http://localhost:5000/get-prompt", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ chapter: `Capitulo_${currentChapter}` }),
      });

      const promptData = await promptRes.json();
      if (!promptRes.ok) {
        throw new Error("Error getting chapter context");
      }

      // Combinar el contexto del capítulo con la pregunta libre
      const contextualizedQuestion = `${promptData.prompt}\n\nPregunta específica: ${freeQuestion}`;

      // Hacer la pregunta con el contexto
      const res = await fetch("http://localhost:3000/ask", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          sourceId: sourceId,
          question: contextualizedQuestion,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.content);
        setShowModal(true);
      } else {
        console.error("Error asking the question:", data.error);
      }
    } catch (error) {
      console.error("Error processing the question:", error);
    } finally {
      setFreeQuestionLoading(false);
    }
  };

  const extractErrors = (content) => {
    const errorMessages = [];
    if (!content.includes("Antecedente histórico")) {
      errorMessages.push(
        "No se incluye una sección de antecedentes históricos."
      );
    }
    if (!content.includes("objetivo de implementar una aplicación web")) {
      errorMessages.push(
        "No se menciona claramente el objetivo de implementar la aplicación web."
      );
    }
    if (!content.includes("Marco metodológico")) {
      errorMessages.push(
        "No se menciona el marco metodológico en los capítulos."
      );
    }
    if (
      !content.includes("Visual Studio Code") ||
      !content.includes("Bootstrap") ||
      !content.includes("PHP")
    ) {
      errorMessages.push(
        "No se describen correctamente las herramientas utilizadas."
      );
    }
    if (!content.includes("Resultados obtenidos y conclusiones")) {
      errorMessages.push(
        "Falta la sección de resultados obtenidos y conclusiones."
      );
    }
    if (!content.includes("Referencias bibliográficas")) {
      errorMessages.push("No se incluyen referencias bibliográficas.");
    }
    if (content.match(/(.+?)\.\s*\1/)) {
      errorMessages.push("Se repiten párrafos en el mismo párrafo.");
    }
    if (!content.includes("introducción")) {
      errorMessages.push(
        "La introducción no incluye todos los elementos requeridos."
      );
    }
    if (!content.includes("conclusión")) {
      errorMessages.push(
        "La conclusión no proporciona un resumen generalizado."
      );
    }
    return errorMessages;
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleNextChapter = () => {
    setCurrentChapter((prevChapter) => prevChapter + 1);
  };

  const handleLogout = async () => {
    try {
      const response = await fetch("http://localhost:3000/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      if (response.ok) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        {showRegister ? (
          <>
            <Register onRegisterSuccess={() => setShowRegister(false)} />
            <button onClick={() => setShowRegister(false)}>
              Ya tengo cuenta
            </button>
          </>
        ) : (
          <>
            <Login onLoginSuccess={() => setIsAuthenticated(true)} />
            <button onClick={() => setShowRegister(true)}>Crear cuenta</button>
          </>
        )}
      </div>
    );
  }

  return (
    <>
      <Header />
      <div className="container">
        <button onClick={handleLogout} className="logout-button">
          Cerrar Sesión
        </button>
        <main className="main-content">
          <h4>Revisión de Documentos</h4>
          <div className="chapter-indicator">
            <h5>Capítulo actual: {currentChapter}</h5>
            <div className="chapter-list">
              {[1, 2, 3, 4].map((chapter) => (
                <button
                  key={chapter}
                  className={`chapter-button ${
                    currentChapter === chapter ? "active" : ""
                  }`}
                  onClick={() => setCurrentChapter(chapter)}
                >
                  Capítulo {chapter}
                </button>
              ))}
            </div>
          </div>
          <div className="file-upload-container">
            <input
              type="file"
              accept="application/pdf"
              onChange={handleFileChange}
              className="file-input"
            />
            <button onClick={handleUpload} className="upload-button">
              Subir Documento
            </button>
          </div>
          {pdfUrl && (
            <div className="pdf-viewer">
              <h5>Vista previa del documento:</h5>
              <iframe
                src={pdfUrl}
                title="Vista previa del documento"
                width="100%"
                height="500px"
              />
            </div>
          )}
          {sourceId && (
            <>
              <div className="review-section">
                <button
                  onClick={handleAskQuestion}
                  className={`review-button ${isLoading ? "loading" : ""}`}
                  disabled={isLoading}
                >
                  {isLoading ? "Revisando..." : "Revisar Documento"}
                </button>
                {isLoading && <div className="loading-spinner"></div>}
                <button
                  onClick={handleNextChapter}
                  className="next-chapter-button"
                >
                  Siguiente Capítulo
                </button>
              </div>

              <div className="free-question-section">
                <h5>
                  Hacer una pregunta específica sobre el Capítulo{" "}
                  {currentChapter}:
                </h5>
                <div className="chapter-info-box">
                  <i className="info-icon">ℹ️</i>
                  <p>
                    Las preguntas que hagas serán respondidas en el contexto del
                    Capítulo {currentChapter}.
                  </p>
                </div>
                <div className="question-input-container">
                  <input
                    type="text"
                    value={freeQuestion}
                    onChange={(e) => setFreeQuestion(e.target.value)}
                    placeholder="Escribe tu pregunta aquí..."
                    className="question-input"
                  />
                  <button
                    onClick={handleFreeQuestion}
                    className={`question-button ${
                      freeQuestionLoading ? "loading" : ""
                    }`}
                    disabled={freeQuestionLoading}
                  >
                    {freeQuestionLoading ? "Consultando..." : "Preguntar"}
                  </button>
                </div>
                {freeQuestionLoading && <div className="loading-spinner"></div>}
              </div>
            </>
          )}
        
      
          {showModal && (
            <div className="modal">
              <div className="modal-content">
                <div className="modal-header">
                  <h2>Análisis del Documento</h2>
                  <p className="modal-subtitle">
                    Reporte de Validación del CAPÍTULO {currentChapter}
                  </p>
                </div>

                <div className="report-section">
                  <h3 className="section-title">Antecedente Histórico</h3>
                  <div className="content-item">
                    <span className="compliance compliance-ok">
                      Cumplimiento
                    </span>{" "}
                    Se incluye una sección que describe la creación y evolución
                    de la empresa Nilsen.
                  </div>
                  <div className="content-item">
                    <span className="compliance compliance-fail">
                      No Cumple
                    </span>{" "}
                    No se menciona claramente el objetivo de implementar una
                    aplicación web para registrar calificaciones y datos de los
                    alumnos. En su lugar, se enfoca en la gestión de facturas.
                  </div>
                </div>

                <div className="report-section">
                  <h3 className="section-title">Contenido del Documento</h3>
                  <div className="content-item">
                    <span className="compliance compliance-fail">
                      No Cumple
                    </span>{" "}
                    El documento no menciona que estará dividido en varios
                    capítulos, incluyendo:
                  </div>
                  <ul className="content-list">
                    <li className="content-item">
                      Marco metodológico: historia de la institución, objetivos
                      y metodología.
                    </li>
                    <li className="content-item">
                      Herramientas utilizadas: Visual Studio Code, Bootstrap,
                      PHP, SQL Server.
                    </li>
                    <li className="content-item">
                      Resultados obtenidos y conclusiones.
                    </li>
                    <li className="content-item">
                      Referencias bibliográficas y anexos.
                    </li>
                  </ul>
                </div>

                <div className="report-section">
                  <h3 className="section-title">
                    Recomendaciones para la Redacción
                  </h3>
                  <div className="content-item">
                    <span className="compliance compliance-ok">
                      Cumplimiento
                    </span>{" "}
                    No se observan repeticiones de párrafos en el mismo párrafo.
                  </div>
                  <div className="content-item">
                    <span className="compliance compliance-ok">
                      Cumplimiento
                    </span>{" "}
                    La numeración de los capítulos es uniforme.
                  </div>
                </div>

                <div className="report-section">
                  <h3 className="section-title">Estructura del Documento</h3>
                  <div className="content-item">
                    <span className="compliance compliance-fail">
                      No Cumple
                    </span>{" "}
                    La introducción no incluye una breve explicación de la
                    problemática, antecedentes, evolución y objetivo del trabajo
                    de manera clara.
                  </div>
                  <div className="content-item">
                    <span className="compliance compliance-fail">
                      No Cumple
                    </span>{" "}
                    El desarrollo no contiene una explicación de los capítulos,
                    su importancia y contenido.
                  </div>
                  <div className="content-item">
                    <span className="compliance compliance-fail">
                      No Cumple
                    </span>{" "}
                    La conclusión no proporciona un resumen generalizado de lo
                    abordado en el documento.
                  </div>
                </div>

                <div className="summary-section">
                  <h3 className="summary-title">Resumen</h3>
                  <p>
                    El CAPÍTULO 1 presenta deficiencias en la claridad de los
                    objetivos de la aplicación web, la estructura de capítulos,
                    y la explicación de la problemática y conclusiones. Se
                    recomienda revisar y ajustar estos aspectos para cumplir con
                    los protocolos de la universidad.
                  </p>
                </div>

                <div className="errors-section">
                  <h3 className="errors-title">Errores encontrados</h3>
                  <div className="error-item">
                    No se incluye una sección de antecedentes históricos.
                  </div>
                  <div className="error-item">
                    No se menciona claramente el objetivo de implementar la
                    aplicación web.
                  </div>
                  <div className="error-item">
                    No se menciona el marco metodológico en los capítulos.
                  </div>
                  <div className="error-item">
                    No se describen correctamente las herramientas utilizadas.
                  </div>
                  <div className="error-item">
                    Falta la sección de resultados obtenidos y conclusiones.
                  </div>
                  <div className="error-item">
                    No se incluyen referencias bibliográficas.
                  </div>
                </div>

                <button className="close-button" onClick={closeModal}>
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </main>
      </div>
      <Footer />
    </>
  );
}

export default App;
