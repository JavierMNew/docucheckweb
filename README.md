# Iniciar Servidores Node.js y Flask

## Iniciar el Servidor Node.js (Express)

1. Abre una terminal.
2. Navega hasta la carpeta del backend:
   ```sh
   cd backend
   ```
3. Entra a la carpeta de Express:
   ```sh
   cd express
   ```
4. Instalar el modulo necesario dentro de la carpeta de express:
   ```sh
   npm install
   ```
5. Iniciar el servidor con:
   ```sh
   npm run dev
   ```
---

## Iniciar el Servidor Flask

1. Abre una terminal.
2. Navega hasta la carpeta del backend:
   ```sh
   cd backend
   ```
3. Entra a la carpeta de Flask:
   ```sh
   cd flask
   ```
4. Activa el entorno virtual (es necesario):
   - En Windows:
     ```sh
     venv\Scripts\activate
     ```
     
5. Ejecuta el servidor Flask:
   ```sh
   python app.py
   ```

# Pasos para configurar el login con google
1. En el navegador escribir google developer console y clic en la primera opción
2. Dar clic en nuevo proyecto
3. Elige el nombre del proyecto ej:"docucheckweb", y sin organización darle a crear
4. Cuando el proyecto se termine de crear y aparezca la notificación darle a seleccionar proyecto
5. En el toolbar o menu de navegación buscar dentro de productos fijados la opción "APIs y servicios" luego en Pantalla de consentimiento OAuth
6. Seleccionar la opción externos y luego al botón de crear
7. Poner nuevamente el nombre de la aplicación, el correo electronico personal o a utilizar
8. Saltarse las demas opciones hasta "Información de contacto del desarrollador" escribir nuevamente el correo, clic al botón de guardar
9. Volver a revisar la toolbar o menú de navegación y seleccionar la opción "Credenciales"
10. Darle clic a "Crear credenciales" y seleccionar la opcioón: "ID de cliente OAuth"
11. Seleccionar tipo de aplicación: Aplicación web 
12. Escribir nuevamente el nombre de la aplicación
13. Clic en agregar URI de la sección "Orígenes autorizados de JavaScript "
14. Ingresar la siguiente URL: http://localhost:3000
15. Clic en agregar URI de la sección "URI de redireccionamiento autorizados"
16. Ingresar la siguiente URL: http://localhost:3000/auth/google/callback
17. Dar clic en crear
18. Copiar el ID de cliente y pegarlo en la variable "GOOGLE_CLIENT_ID" del archivo .env
19. Copiar el Secreto del cliente y pegarlo en la variable "GOOGLE_CLIENT_SECRET" del archivo .env
    - Hacer los pasos para iniciar el servidor de Node.js pero antes de correrlo, ingresar el siguiente comando con la libreria necesaria de google: npm install passport passport-google-oauth20
    Una vez que se haya instalado, correr el servidor y sin olvidar correr el servidor de mongoDB

    - Para probarlo con Postman ingresar la siguiente URL: http://localhost:3000/auth/google
    Seleccionar la pestaña Authorization, hacer scroll hasta "Configure New Token" y en los campos poner lo siguiente:
    Token Name: Google Auth Token
    Grant Type: Authorization Code
    Callback URL: http://localhost:3000/auth/google/callback
    Auth URL: https://accounts.google.com/o/oauth2/v2/auth
    Access Token URL: https://oauth2.googleapis.com/token
    Client ID: Tu GOOGLE_CLIENT_ID /No variables, la credencial ingresada en .env/
    Client Secret: Tu GOOGLE_CLIENT_SECRET /No variables, la credencial ingresada en .env/
    Scope: profile email
    State: (opcional)
    Client Authentication: Send as Basic Auth header
    - Dar clic en "Get New Access Token"
    - Ingresar tu correo y contraseña
    - Automaticamente te pondra el token por lo que solo debes enviar la solicitud
    - En cualquier navegador poner la siguiente URL: http://localhost:3000/auth/google
    - Ingresar en una cuenta de google y verificar que la respuesta .JSON sea correcta 

# Documentación de la API

## 1. Registro de Usuario

**Endpoint:**

```
POST http://localhost:3000/auth/register
```

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
    "username": "newuser",
    "email": "newuser@example.com",
    "password": "password123"
}
```
**Respuesta (200 OK):**

```json
{
    "message": "User created successfully"
}
```



## 2. Inicio de Sesión

**Endpoint:**

```
POST /auth/login
```

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
    "username": "testuser",
    "password": "123456"
}
```

**o**

```json
{
    "username": "admin",
    "password": "admin123"
}
```

**Respuesta (200 OK):**

```json
{
    "message": "Login successful"
}
```

**Nota:** La respuesta incluye una cookie de sesión que debe usarse en las solicitudes posteriores.

## 3. Cerrar Sesión

**Endpoint:**

```
POST /auth/logout
```

**Headers:**

```
Cookie: connect.sid=<session-cookie>
```

**Respuesta (200 OK):**

```json
{
    "message": "Logout successful",
    "status": "success"
}
```

# Gestión de Documentos

## 4. Subir PDF

**Endpoint:**

```
POST /upload
```

**Headers:**

```
Cookie: connect.sid=<session-cookie>
Content-Type: multipart/form-data
```

**Formulario:**

- **Clave:** `file`
- **Valor:** [Archivo PDF]

**Respuesta (200 OK):**

```json
{
    "sourceId": "src_abc123xyz",
    "needsReview": false
}
```

## 5. Realizar una Pregunta

**Endpoint:**

```
POST /ask
```

**Headers:**

```
Cookie: connect.sid=<session-cookie>
Content-Type: application/json
```

**Body:**

```json
{
    "sourceId": "src_abc123xyz",
    "question": "De que trata el PDF"
}
```

**Respuesta (200 OK):**

```json
{
    "content": "Response from ChatPDF API",
    "sourceId": "src_abc123xyz"
}
```

## Ver mis PDFs (como usuario)

### Obtener lista de PDFs
**GET** `http://localhost:3000/upload/my-documents`

**Headers:**
```
Cookie: connect.sid=<session-cookie>
```

**Response 200:**
```json
{
  "total": 2,
  "documents": [
    {
      "_id": "doc123",
      "filename": "1705789456789.pdf",
      "originalName": "documento1.pdf",
      "sourceId": "src_abc123",
      "createdAt": "2024-01-20T12:00:00Z",
      "needsReview": false,
      "approved": null
    }
    // ... más documentos
  ]
}
```

### Ver detalle de un PDF en específico (como usurio)
**GET** `http://localhost:3000/upload/document/idDelPDF`

**Headers:**
```
Cookie: connect.sid=<session-cookie>
```

**Response 200:**
```json
{
  "_id": "doc123",
  "filename": "1705789456789.pdf",
  "originalName": "documento1.pdf",
  "sourceId": "src_abc123",
  "createdAt": "2024-01-20T12:00:00Z",
  "needsReview": false,
  "approved": null
}
```

# Endpoints de Administración

## 6. Obtener Documentos Pendientes de Revisión

**Endpoint:**

```
GET /admin/review
```

**Headers:**

```
Cookie: connect.sid=<session-cookie>
```

**Respuesta (200 OK):**

```json
[
    {
        "_id": "doc123",
        "filename": "document.pdf",
        "originalName": "original.pdf",
        "userId": {
            "username": "testuser",
            "email": "test@example.com"
        },
        "sourceId": "src_abc123xyz",
        "uploadCount": 6,
        "needsReview": true
    }
]
```

## 7. Obtener Todos los Usuarios

**Endpoint:**

```
GET /admin/users
```

**Headers:**

```
Cookie: connect.sid=<session-cookie>
```

**Respuesta (200 OK):**

```json
[
    {
        "_id": "user123",
        "username": "testuser",
        "email": "test@example.com",
        "isAdmin": false,
        "createdAt": "2024-01-20T00:00:00.000Z"
    }
]
```

## 8. Convertir un Usuario en Administrador

**Endpoint:**

```
POST /admin/make-admin/:userId
```

**Headers:**

```
Cookie: connect.sid=<session-cookie>
```

**Respuesta (200 OK):**

```json
{
    "message": "User is now an admin",
    "user": "testuser"
}
```

## 9. Revisar un Documento

**Endpoint:**

```
POST /admin/review/:documentId
```

**Headers:**

```
Cookie: connect.sid=<session-cookie>
Content-Type: application/json
```

**Body:**

```json
{
    "approved": true
}
```

**Respuesta (200 OK):**

```json
{
    "message": "Document reviewed",
    "approved": true
}
```

## 10. Ver Todos los Documentos (como admin)

**Endpoint:**

```
GET http://localhost:3000/admin/documents
```

**Headers:**

```
Cookie: connect.sid=<session-cookie>
```

**Respuesta (200 OK):**

```json
[
  {
    "_id": "doc123",
    "filename": "1705789456789.pdf",
    "originalName": "documento1.pdf",
    "userId": {
      "_id": "user123",
      "username": "usuario1",
      "email": "usuario1@example.com"
    },
    "sourceId": "src_abc123",
    "createdAt": "2024-01-20T12:00:00Z"
  }
]
```

## 11. Ver Documentos de un Usuario Específico (como admin)

**Endpoint:**

```
GET http://localhost:3000/admin/documents/user/user123
```

**Headers:**

```
Cookie: connect.sid=<session-cookie>
```

**Respuesta (200 OK):**

```json
[
  {
    "_id": "doc123",
    "filename": "1705789456789.pdf",
    "originalName": "documento1.pdf",
    "userId": {
      "_id": "user123",
      "username": "usuario1",
      "email": "usuario1@example.com"
    },
    "sourceId": "src_abc123",
    "createdAt": "2024-01-20T12:00:00Z"
  }
]
```

# Validación de Documentos

## 12. Obtener Prompt para Validar un Capítulo

**Endpoint:**

```
POST /get-prompt
```

**Headers:**

```
Content-Type: application/json
```

**Body:**

```json
{
    "chapter": "Capitulo_1"
}
```

**Respuesta (200 OK):**

```json
{
    "prompt": "Contenido del prompt para el capítulo..."
}
```

**Error (404):**

```json
{
    "error": "El prompt para Capitulo_1 no se encuentra cargado."
}
```

## 13. Validar Documento DOCX

**Endpoint:**

```
POST http://localhost:5000/validate-docx-file
```

**Headers:**

```
Content-Type: multipart/form-data
```

**Formulario:**

- **Clave:** `file`
- **Valor:** [Seleccionar archivo .docx]

**Notas Importantes:**
- El archivo debe ser un `.docx` válido.
- Solo se validan los títulos especificados.
- Se verifican tanto el tamaño como el tipo de fuente.



# Manejo de Errores

## Errores de Autenticación

**401 Unauthorized:**

```json
{
    "error": "Invalid credentials"
}
```

**403 Forbidden:**

```json
{
    "error": "Forbidden"
}
```

## Errores de Validación

**400 Bad Request:**

```json
{
    "error": "Validation error message"
}
```

## Errores del Servidor

**500 Internal Server Error:**

```json
{
    "error": "Error message",
    "details": "Additional error details"
}
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

