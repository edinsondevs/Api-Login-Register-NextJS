import swaggerJsdoc from 'swagger-jsdoc';

const options: swaggerJsdoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Autenticación con Next.js',
      version: '1.0.0',
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
  apis: ['./src/pages/api/**/*.ts', './src/schemas/*.ts'],
};

export const swaggerSpec = swaggerJsdoc(options);
