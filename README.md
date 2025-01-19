# **Documentación de la API del Backend a IntegradoraWeb**

## **Base URL**
La base URL para acceder al backend es:  
`http://localhost:5000/`  
(Recuerda que esto puede variar dependiendo de tu entorno de producción)



## **1. Subir un Documento**
**URL**: `/upload`  
**Método**: `POST`  
**Descripción**: Este endpoint permite subir un documento (por ejemplo, un archivo PDF) al servidor para su procesamiento con la API de ChatPDF.

### **Request**
- **Body**:
  - `file`: El archivo PDF que se desea cargar.

### **Respuesta**
- **Código 200 (OK)**:
```json
{
  "sourceId": "ID_GENERADO_DEL_DOCUMENTO"
}
```
### **Ejemplo de Consumo desde el Frontend**

```
import React, { useState } from 'react';

function App() {
  const [file, setFile] = useState(null);
  const [sourceId, setSourceId] = useState(null);

  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    const formData = new FormData();
    formData.append('file', file);
    const res = await fetch('http://localhost:5000/upload', { method: 'POST', body: formData });
    const data = await res.json();
    if (res.ok) setSourceId(data.sourceId);
  };

  return (
    <div>
      <input type="file" onChange={handleFileChange} />
      <button onClick={handleUpload}>Subir Documento</button>
      {sourceId && <p>Documento cargado, Source ID: {sourceId}</p>}
    </div>
  );
}

export default App;
```

## **2. Hacer Preguntas sobre el Documento**

**URL:** `/ask`  
**Método:** `POST`  
**Descripción:** Este endpoint permite hacer una pregunta sobre el contenido de un documento previamente cargado, utilizando el `sourceId` obtenido al subir el archivo.

### Request

**Body:**
- `sourceId`: El identificador único del documento.
- `question`: La pregunta que el usuario desea hacer sobre el contenido del documento.

### Respuesta

- **Código 200 (OK)**:

```json
{
  "content": "contenido del documento."
}
```

### **Ejemplo de Consumo desde el Frontend**

```
import React, { useState } from 'react';

function App() {
  const [sourceId, setSourceId] = useState('some-id');
  const [question, setQuestion] = useState('');
  const [response, setResponse] = useState('');

  const handleAskQuestion = async () => {
    const res = await fetch('http://localhost:5000/ask', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sourceId, question }),
    });
    const data = await res.json();
    if (res.ok) setResponse(data.content);
  };

  return (
    <div>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Escribe tu pregunta"
      />
      <button onClick={handleAskQuestion}>Preguntar</button>
      {response && <p>Respuesta: {response}</p>}
    </div>
  );
}

export default App;

```
# Astro Starter Kit: Basics

```sh
npm create astro@latest -- --template basics
```

[![Open in StackBlitz](https://developer.stackblitz.com/img/open_in_stackblitz.svg)](https://stackblitz.com/github/withastro/astro/tree/latest/examples/basics)
[![Open with CodeSandbox](https://assets.codesandbox.io/github/button-edit-lime.svg)](https://codesandbox.io/p/sandbox/github/withastro/astro/tree/latest/examples/basics)
[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/withastro/astro?devcontainer_path=.devcontainer/basics/devcontainer.json)

> 🧑‍🚀 **Seasoned astronaut?** Delete this file. Have fun!

![just-the-basics](https://github.com/withastro/astro/assets/2244813/a0a5533c-a856-4198-8470-2d67b1d7c554)

## 🚀 Project Structure

Inside of your Astro project, you'll see the following folders and files:

```text
/
├── public/
│   └── favicon.svg
├── src/
│   ├── layouts/
│   │   └── Layout.astro
│   └── pages/
│       └── index.astro
└── package.json
```

To learn more about the folder structure of an Astro project, refer to [our guide on project structure](https://docs.astro.build/en/basics/project-structure/).

## 🧞 Commands

All commands are run from the root of the project, from a terminal:

| Command                   | Action                                           |
| :------------------------ | :----------------------------------------------- |
| `npm install`             | Installs dependencies                            |
| `npm run dev`             | Starts local dev server at `localhost:4321`      |
| `npm run build`           | Build your production site to `./dist/`          |
| `npm run preview`         | Preview your build locally, before deploying     |
| `npm run astro ...`       | Run CLI commands like `astro add`, `astro check` |
| `npm run astro -- --help` | Get help using the Astro CLI                     |

## 👀 Want to learn more?

Feel free to check [our documentation](https://docs.astro.build) or jump into our [Discord server](https://astro.build/chat).

