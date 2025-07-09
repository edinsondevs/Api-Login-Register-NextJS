import { withSwagger } from 'next-swagger-doc';

const swaggerHandler = withSwagger({
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'API de Autenticación con Next.js',
      version: '2.0.0',
      description:
        'Una API simple para la autenticación de usuarios construida con Next.js, MongoDB y TypeScript.',
    },
		components: {
			securitySchemes: {
				bearerAuth: {
					type: "http",
					scheme: "bearer",
					bearerFormat: "JWT",
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

export default swaggerHandler();