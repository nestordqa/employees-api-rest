# ✨ Wecaria API Rest - Desafío Técnico ✨

## ¡Bienvenido al corazón de la gestión de empleados! 🚀

Este proyecto representa una API REST construida con Node.js, TypeScript y MongoDB, diseñada para administrar empleados de manera eficiente y segura. Implementa autenticación y autorización con JWT y se adhiere a las mejores prácticas para garantizar un código limpio, escalable y mantenible.

## 🏛️ Estructura del Proyecto

```
wecaria-api-rest/
├── src/
│   ├── config/            # ⚙️ Configuraciones (DB, JWT, CORS, etc.)
│   ├── controllers/       # 🧠 Lógica de negocio (CRUD empleados, autenticación)
│   ├── middlewares/       # 🛡️ Autenticación, manejo de errores
│   ├── models/            # 📚 Esquemas de Mongoose
│   ├── routes/            # 🛣️ Definición de rutas
│   ├── utils/             # 🛠️ Funciones de utilidad (ej. respuesta estandarizada)
│   ├── app.ts             # ⚙️ Configuración de Express
│   └── server.ts          # 🚀 Inicialización del servidor
├── tests/               # ✅ Pruebas unitarias
├── .env                 # 🔑 Variables de entorno
├── .eslintrc.js         # 📏 Configuración de ESLint
├── .prettierrc.js       # 💅 Configuración de Prettier
├── docker-compose.yml   # 🐳 Configuración de Docker Compose
├── Dockerfile           # 🐳 Instrucciones para construir imagen de la API Rest
├── package.json
├── tsconfig.json        # ⌨️ Configuración de TypeScript
└── README.md
```

## 🚀 Primeros Pasos

### Requisitos

Antes de comenzar, asegúrate de tener instalado lo siguiente:

*   [Node.js](https://nodejs.org/en/) (versión 18 o superior)
*   [Docker](https://www.docker.com/)
*   [Docker Compose](https://docs.docker.com/compose/)

### Instalación

1.  Clona el repositorio:

    ```bash
    git clone https://github.com/nestordqa/employees-api-rest.git
    cd employees-api-rest
    ```

2.  Instala las dependencias:

    ```bash
    npm install
    ```

### Configuración del Entorno

Crea un archivo `.env` en la raíz del proyecto y define las siguientes variables de entorno:

```
PORT=3000
MONGODB_URI=mongodb://000.000.00.00:27017/employees  # ⚠️ ¡Reemplaza con tu IP!
JWT_SECRET=wacaria-jason-web-token-secret
JWT_EXPIRATION=1h
POSITIONS_API_URL=https://ibillboard.com/api/positions
```

**¡Importante!**

*   Reemplaza `000.000.00.00` con la dirección IP de tu instancia de MongoDB.
*   Asegúrate de guardar el archivo `.env` correctamente.

### Ejecutando la Aplicación con Docker

1.  Levanta la aplicación con Docker Compose:

    ```bash
    npm run docker:up
    ```

    Este comando construye la imagen de Docker y levanta los servicios de MongoDB y la API.

2.  Baja la aplicación con Docker Compose:

    ```bash
    npm run docker:down
    ```

    Este comando detiene y elimina los contenedores creados por Docker Compose.

## 📖 Documentación de la API

Explora la documentación interactiva de la API a través de Swagger en [http://localhost:3000/api/docs](http://localhost:3000/api/docs). Aquí encontrarás todos los detalles sobre las rutas disponibles, los parámetros de solicitud y los esquemas de respuesta.

## ✅ Ejecutando Pruebas

Realiza pruebas unitarias para verificar la integridad del código con el siguiente comando:

```bash
npm run test
```

Este comando ejecuta pruebas relacionadas con los archivos y funcionalidades más importantes del proyecto.

## 🔑 Autenticación

La API utiliza JWT (JSON Web Tokens) para la autenticación. Sigue estos pasos:

1.  **Registro:**

    Crea un nuevo usuario enviando una solicitud POST a `/api/auth/register` con el siguiente cuerpo JSON:

    ```json
    {
      "email": "batman@empresas-wayne.com",
      "password": "Alfred1939",
      "firstName": "Bruce",
      "lastName": "Wayne"
    }
    ```

2.  **Inicio de Sesión:**

    Autentica un usuario existente enviando una solicitud POST a `/api/auth/login` con el siguiente cuerpo JSON:

    ```json
    {
      "email": "atman@empresas-wayne.com",
      "password": "Alfred1939"
    }
    ```

    La respuesta incluirá un JWT.

3.  **Autorización:**

    Incluye el JWT en el encabezado `Authorization` de todas las solicitudes subsiguientes a las rutas protegidas. El encabezado debe tener el formato `Bearer `.

    Si el JWT no se proporciona o no es válido, la API devolverá un error `401 Unauthorized`.

4.  **Cierre de Sesión:**

    Invalida el token actual enviando una solicitud POST a `/api/auth/logout` con la autorización correcta. Esto evitará que se realicen más solicitudes con el mismo token.

---

## ¡Espero de todo corazón disfruten de mi prueba técnica! 💻🎉
