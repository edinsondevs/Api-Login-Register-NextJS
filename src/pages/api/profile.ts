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

/**
 * @swagger
 * /api/profile:
 *   get:
 *     summary: Obtiene el perfil del usuario autenticado
 *     tags: [Perfiles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Perfil del usuario obtenido exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserProfileResponse'
 *       401:
 *         description: No autorizado (token inválido o no proporcionado)
 *       404:
 *         description: Usuario no encontrado
 *       405:
 *         description: Método no permitido
 */
// pages/api/profile.ts
import type { NextApiResponse } from "next";
import { authenticate, AuthenticatedRequest } from "@/middleware/auth";
import dbConnect from "@/src/lib/mongodb";
import User from "@/src/models/User";

export default async function handler(
	req: AuthenticatedRequest,
	res: NextApiResponse
) {
	if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

	await dbConnect();
	let authorized = false;

	authenticate(req, res, async () => {
		authorized = true;
		const user = await User.findById(req.user?.userId).select("-password -__v -createdAt -updatedAt -_id");
		if (!user) return res.status(404).json({ error: "User not found" });
		res.status(200).json({ user });
	});

	if (!authorized) return;
}