/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registra un nuevo usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegister'
 *     responses:
 *       201:
 *         description: Usuario creado exitosamente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Error de validación
 *       409:
 *         description: El correo ya está en uso
 *       405:
 *         description: Método no permitido
 */
// pages/api/auth/register.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect  from "@/src/lib/mongodb";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/src/schemas/userSchema";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
	await dbConnect();

	const result = registerSchema.safeParse(req.body);
	if (!result.success) return res.status(400).json(result.error);

	const { name, email, password } = result.data;
	const userExists = await User.findOne({ email });
	if (userExists)
		return res.status(409).json({ error: "Email already in use" });

	const hashedPassword = await bcrypt.hash(password, 10);
	const user = await User.create({ name, email, password: hashedPassword });
	res.status(201).json({
		success: true,
		user: { name: user.name, email: user.email },
	});
}

