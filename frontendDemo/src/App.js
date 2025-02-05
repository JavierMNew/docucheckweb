import React, { useState, useEffect } from 'react';
import './App.css';
import Login from './components/Login';
import Register from './components/Register';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [file, setFile] = useState(null);
  const [sourceId, setSourceId] = useState(null);
  const [pdfUrl, setPdfUrl] = useState(null);
  const [response, setResponse] = useState(null);
  const [errors, setErrors] = useState([]);
  const [prompt, setPrompt] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [currentChapter, setCurrentChapter] = useState(1); // Estado para el capítulo actual
  const [isLoading, setIsLoading] = useState(false);
  const [freeQuestion, setFreeQuestion] = useState('');
  const [freeQuestionLoading, setFreeQuestionLoading] = useState(false);

  // Cargar el prompt del capítulo actual desde el backend
  useEffect(() => {
    const loadPrompt = async () => {
      try {
        const res = await fetch('http://localhost:5000/get-prompt', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ chapter: `Capitulo_${currentChapter}` }),
        });
        const data = await res.json();
        if (res.ok) {
          setPrompt(data.prompt);
        } else {
          console.error('Error fetching prompt:', data.error);
        }
      } catch (error) {
        console.error('Error loading the prompt:', error);
      }
    };
    loadPrompt();
  }, [currentChapter]); // Recargar el prompt cuando cambie el capítulo actual

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('http://localhost:3000/upload', {
        method: 'POST',
        credentials: 'include',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSourceId(data.sourceId);
        setPdfUrl(URL.createObjectURL(file)); // Crear una URL para visualizar el archivo PDF
      } else {
        console.error('Error uploading the document:', data.error);
      }
    } catch (error) {
      console.error('Error uploading the document:', error);
    }
  };

  const handleAskQuestion = async () => {
    if (!prompt) {
      console.error('Prompt not loaded yet.');
      return;
    }

    setIsLoading(true); // Activar loading
    try {
      const res = await fetch('http://localhost:3000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ sourceId: sourceId, question: prompt }),
      });
      const data = await res.json();
      if (res.ok) {
        setResponse(data.content);
        setErrors(extractErrors(data.content));
        setShowModal(true); 
      } else {
        console.error('Error asking the question:', data.error);
      }
    } catch (error) {
      console.error('Error asking the question:', error);
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
      const promptRes = await fetch('http://localhost:5000/get-prompt', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ chapter: `Capitulo_${currentChapter}` }),
      });
      
      const promptData = await promptRes.json();
      if (!promptRes.ok) {
        throw new Error('Error getting chapter context');
      }

      // Combinar el contexto del capítulo con la pregunta libre
      const contextualizedQuestion = `${promptData.prompt}\n\nPregunta específica: ${freeQuestion}`;

      // Hacer la pregunta con el contexto
      const res = await fetch('http://localhost:3000/ask', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ 
          sourceId: sourceId, 
          question: contextualizedQuestion 
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setResponse(data.content);
        setShowModal(true);
      } else {
        console.error('Error asking the question:', data.error);
      }
    } catch (error) {
      console.error('Error processing the question:', error);
    } finally {
      setFreeQuestionLoading(false);
    }
  };

  const extractErrors = (content) => {
    const errorMessages = [];
    if (!content.includes('Antecedente histórico')) {
      errorMessages.push('No se incluye una sección de antecedentes históricos.');
    }
    if (!content.includes('objetivo de implementar una aplicación web')) {
      errorMessages.push('No se menciona claramente el objetivo de implementar la aplicación web.');
    }
    if (!content.includes('Marco metodológico')) {
      errorMessages.push('No se menciona el marco metodológico en los capítulos.');
    }
    if (!content.includes('Visual Studio Code') || !content.includes('Bootstrap') || !content.includes('PHP')) {
      errorMessages.push('No se describen correctamente las herramientas utilizadas.');
    }
    if (!content.includes('Resultados obtenidos y conclusiones')) {
      errorMessages.push('Falta la sección de resultados obtenidos y conclusiones.');
    }
    if (!content.includes('Referencias bibliográficas')) {
      errorMessages.push('No se incluyen referencias bibliográficas.');
    }
    if (content.match(/(.+?)\.\s*\1/)) {
      errorMessages.push('Se repiten párrafos en el mismo párrafo.');
    }
    if (!content.includes('introducción')) {
      errorMessages.push('La introducción no incluye todos los elementos requeridos.');
    }
    if (!content.includes('conclusión')) {
      errorMessages.push('La conclusión no proporciona un resumen generalizado.');
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
      const response = await fetch('http://localhost:3000/auth/logout', {
        method: 'POST',
        credentials: 'include'
      });
      if (response.ok) {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="container">
        {showRegister ? (
          <>
            <Register onRegisterSuccess={() => setShowRegister(false)} />
            <button onClick={() => setShowRegister(false)}>Ya tengo cuenta</button>
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
    <div className="container">
      <button onClick={handleLogout} className="logout-button">Cerrar Sesión</button>
      <main className="main-content">
        <h4>Revisión de Documentos</h4>
        <div className="chapter-indicator">
          <h5>Capítulo actual: {currentChapter}</h5>
          <div className="chapter-list">
            {[1, 2, 3, 4].map(chapter => (
              <button 
                key={chapter}
                className={`chapter-button ${currentChapter === chapter ? 'active' : ''}`}
                onClick={() => setCurrentChapter(chapter)}
              >
                Capítulo {chapter}
              </button>
            ))}
          </div>
        </div>
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="file-input" />
        <button onClick={handleUpload} className="upload-button">Subir Documento</button>
        
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
                className={`review-button ${isLoading ? 'loading' : ''}`}
                disabled={isLoading}
              >
                {isLoading ? 'Revisando...' : 'Revisar Documento'}
              </button>
              {isLoading && <div className="loading-spinner"></div>}
              <button onClick={handleNextChapter} className="next-chapter-button">Siguiente Capítulo</button>
            </div>
            
            <div className="free-question-section">
              <h5>Hacer una pregunta específica sobre el Capítulo {currentChapter}:</h5>
              <div className="chapter-info-box">
                <i className="info-icon">ℹ️</i>
                <p>Las preguntas que hagas serán respondidas en el contexto del Capítulo {currentChapter}.</p>
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
                  className={`question-button ${freeQuestionLoading ? 'loading' : ''}`}
                  disabled={freeQuestionLoading}
                >
                  {freeQuestionLoading ? 'Consultando...' : 'Preguntar'}
                </button>
              </div>
              {freeQuestionLoading && <div className="loading-spinner"></div>}
            </div>
          </>
        )}

        {showModal && (
          <div className="modal">
            <div className="modal-content">
              <h2>Análisis del Documento</h2>
              <h3>Respuesta del sistema:</h3>
              <ul>
                {response.split('\n').map((line, index) => (
                  <li key={index}>{line}</li>
                ))}
              </ul>
              <h3>Errores encontrados:</h3>
              <ul>
                {errors.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
              <button onClick={closeModal}>Cerrar</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;