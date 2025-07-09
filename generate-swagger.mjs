import { createSwaggerSpec } from 'next-swagger-doc';
import fs from 'fs';

const spec = createSwaggerSpec({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Autenticación con Next.js',
      version: '2.0.1',
      description:
        'Una API simple para la autenticación de usuarios construida con Next.js, MongoDB y TypeScript.',
    },
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apiFolder: 'src/pages/api',
});

fs.writeFileSync('public/openapi.json', JSON.stringify(spec, null, 2));
