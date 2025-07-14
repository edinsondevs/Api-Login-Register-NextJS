# API Login Next.js

Este proyecto es una aplicación de autenticación de usuarios construida con Next.js, que incluye funcionalidades de registro, inicio de sesión y gestión de perfiles, con integración a MongoDB y un sistema de testing robusto.

## Características

-   **Autenticación de Usuarios:** Registro y Login con validación de credenciales.
-   **Gestión de Perfiles:** Acceso a la información del perfil del usuario autenticado.
-   **Base de Datos:** Integración con MongoDB para el almacenamiento de usuarios.
-   **Seguridad:** Contraseñas hasheadas con `bcryptjs` y autenticación basada en JSON Web Tokens (JWT).
-   **Validación de Datos:** Uso de `Zod` para la validación de esquemas de entrada.
-   **API RESTful:** Endpoints claros y bien definidos para las operaciones de autenticación y perfil.
-   **Documentación de API:** Generación automática de documentación OpenAPI (Swagger UI).
-   **Testing:** Pruebas unitarias con Jest y cobertura de código.

## Tecnologías Utilizadas

### Frontend (Next.js)

-   [**Next.js**](https://nextjs.org/): Framework de React para aplicaciones web con renderizado del lado del servidor y generación de sitios estáticos.
-   [**React**](https://react.dev/): Biblioteca de JavaScript para construir interfaces de usuario.
-   [**Tailwind CSS**](https://tailwindcss.com/): Framework CSS para un desarrollo rápido y personalizado de la interfaz de usuario.

### Backend (Next.js API Routes)

-   [**Mongoose**](https://mongoosejs.com/): Modelado de objetos para MongoDB en un entorno Node.js.
-   [**bcryptjs**](https://www.npmjs.com/package/bcryptjs): Librería para el hashing y salting de contraseñas.
-   [**jsonwebtoken**](https://www.npmjs.com/package/jsonwebtoken): Implementación de JSON Web Tokens para la autenticación.
-   [**Zod**](https://zod.dev/): Librería de declaración y validación de esquemas TypeScript-first.

### Desarrollo y Testing

-   [**Jest**](https://jestjs.io/): Framework de pruebas de JavaScript.
-   [**@shelf/jest-mongodb**](https://www.npmjs.com/package/@shelf/jest-mongodb): Preset de Jest para facilitar las pruebas con MongoDB en memoria.
-   [**node-mocks-http**](https://www.npmjs.com/package/node-mocks-http): Utilidad para simular objetos de solicitud y respuesta HTTP en pruebas de Node.js.
-   [**dotenv**](https://www.npmjs.com/package/dotenv): Carga variables de entorno desde un archivo `.env`.
-   [**TypeScript**](https://www.typescriptlang.org/): Superset de JavaScript que añade tipado estático.

## Primeros Pasos

Sigue estas instrucciones para configurar y ejecutar el proyecto en tu entorno local.

### Prerrequisitos

-   [Node.js](https://nodejs.org/en/) (versión 18 o superior)
-   [npm](https://www.npmjs.com/) (o yarn/pnpm/bun)
-   Una instancia de [MongoDB](https://www.mongodb.com/docs/manual/installation/) ejecutándose (localmente o en la nube).

### Instalación

1.  Clona el repositorio:
    ```bash
    git clone <URL_DEL_REPOSITORIO>
    cd api-login-netxjs
    ```

2.  Instala las dependencias del proyecto:
    ```bash
    npm install
    ```

### Configuración de Variables de Entorno

Crea un archivo `.env.local` en la raíz del proyecto (basado en `.env.example`) y configura las siguientes variables:

```env
MONGODB_URI=mongodb://localhost:27017/your_database_name
JWT_SECRET=your_jwt_secret_key
```

-   `MONGODB_URI`: La cadena de conexión a tu base de datos MongoDB.
-   `JWT_SECRET`: Una clave secreta fuerte para firmar y verificar los JWTs. Puedes generar una con `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`.

### Ejecución del Proyecto

1.  **Modo Desarrollo:**
    ```bash
    npm run dev
    ```
    Abre [http://localhost:3000](http://localhost:3000) en tu navegador para ver la aplicación.

2.  **Construir para Producción:**
    ```bash
    npm run build
    ```
    Este comando también generará la documentación de Swagger/OpenAPI.

3.  **Modo Producción:**
    ```bash
    npm run start
    ```

## Endpoints de la API

Los endpoints de la API están construidos usando las API Routes de Next.js.

-   **`POST /api/auth/register`**
    -   **Descripción:** Registra un nuevo usuario en el sistema.
    -   **Request Body:** `{ name, email, password }`
    -   **Respuestas:** `201 Created`, `400 Bad Request` (validación), `409 Conflict` (email ya en uso).

-   **`POST /api/auth/login`**
    -   **Descripción:** Autentica a un usuario y devuelve un JSON Web Token (JWT).
    -   **Request Body:** `{ email, password }`
    -   **Respuestas:** `200 OK` (con JWT), `401 Unauthorized` (credenciales inválidas).

-   **`GET /api/profile`**
    -   **Descripción:** Obtiene el perfil del usuario autenticado.
    -   **Headers:** `Authorization: Bearer <JWT_TOKEN>`
    -   **Respuestas:** `200 OK` (con datos de usuario), `401 Unauthorized` (token inválido/ausente), `404 Not Found` (usuario no encontrado).

## Seguridad

-   **Hashing de Contraseñas:** Las contraseñas de los usuarios se almacenan en la base de datos utilizando `bcryptjs` para asegurar que nunca se guarden en texto plano.
-   **Autenticación JWT:** Se utilizan JSON Web Tokens para la autenticación de usuarios. Una vez que un usuario inicia sesión, se le emite un token que debe incluir en las cabeceras de las solicitudes subsiguientes para acceder a rutas protegidas.
-   **Middleware de Autenticación:** La ruta `/api/profile` está protegida por un middleware (`middleware/auth.ts`) que verifica la validez del JWT antes de permitir el acceso.

## Testing

El proyecto incluye pruebas unitarias para los endpoints de la API utilizando Jest.

-   **Ejecutar todas las pruebas:**
    ```bash
    npm test
    ```

-   **Ejecutar pruebas y generar reporte de cobertura:**
    ```bash
    npm run test:coverage
    ```
    El reporte de cobertura se generará en la carpeta `coverage/`.

## Documentación de la API (Swagger UI)

La documentación interactiva de la API se genera automáticamente utilizando `next-swagger-doc`.

-   Para acceder a la documentación, primero construye el proyecto:
    ```bash
    npm run build
    ```
-   Luego, inicia el servidor en modo producción:
    ```bash
    npm run start
    ```
-   Finalmente, abre tu navegador y navega a:
    [http://localhost:3000/api/docs](http://localhost:3000/api/docs)

## Despliegue en Vercel

La forma más sencilla de desplegar tu aplicación Next.js es usar la [Plataforma Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) de los creadores de Next.js.

Consulta la [documentación de despliegue de Next.js](https://nextjs.org/docs/app/building-your-application/deploying) para más detalles.