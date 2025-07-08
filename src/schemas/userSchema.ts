/**
 * @swagger
 * components:
 *   schemas:
 *     UserRegister:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
 *       properties:
 *         name:
 *           type: string
 *           description: Nombre del usuario
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario (mínimo 6 caracteres)
 *     UserLogin:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           description: Correo electrónico del usuario
 *         password:
 *           type: string
 *           format: password
 *           description: Contraseña del usuario
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Nombre del usuario
 *             email:
 *               type: string
 *               format: email
 *               description: Correo electrónico del usuario
 *     UserProfileResponse:
 *       type: object
 *       properties:
 *         user:
 *           type: object
 *           properties:
 *             name:
 *               type: string
 *               description: Nombre del usuario
 *             email:
 *               type: string
 *               format: email
 *               description: Correo electrónico del usuario
 */
// schemas/userSchema.ts
import { z } from "zod";

export const registerSchema = z.object({
	name: z.string().min(1, "Name is required"),
	email: z.string().email("Invalid email"),
	password: z.string().min(6, "Password must be at least 6 characters"),
});

export const loginSchema = z.object({
	email: z.string().email("Invalid email"),
	password: z.string().min(1, "Password is required"),
});
