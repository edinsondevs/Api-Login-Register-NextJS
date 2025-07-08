import swaggerJsdoc from 'swagger-jsdoc';
import path from 'path';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: "3.0.0",
		info: {
			title: "API de Autenticación con Next.js",
			version: "1.0.0",
			description:
				"Una API simple para la autenticación de usuarios construida con Next.js, MongoDB y TypeScript.",
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
	apis: [
		path.join(process.cwd(), "src/pages/api/**/*.ts"),
		path.join(process.cwd(), "src/schemas/**/*.ts"), // Si tienes esquemas
	],
};

export const swaggerSpec = swaggerJsdoc(options);
