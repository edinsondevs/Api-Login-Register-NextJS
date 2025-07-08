/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Inicia sesión de un usuario
 *     tags: [Autenticación]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserLogin'
 *     responses:
 *       200:
 *         description: Inicio de sesión exitoso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: JWT para la sesión del usuario
 *       400:
 *         description: Error de validación
 *       401:
 *         description: Credenciales inválidas
 *       405:
 *         description: Método no permitido
 */
// pages/api/auth/login.ts
import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/src/lib/mongodb";
import User from "@/src/models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "@/src/schemas/userSchema";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	if (req.method !== "POST") return res.status(405).end("Method Not Allowed");
	await dbConnect();

	const result = loginSchema.safeParse(req.body);
	if (!result.success) return res.status(400).json(result.error);

	const { email, password } = result.data;
	const user = await User.findOne({ email });
	if (!user) return res.status(401).json({ error: "Invalid credentials" });

	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

	const token = jwt.sign(
		{ userId: user._id, email: user.email },
		process.env.JWT_SECRET as string,
		{ expiresIn: "7d" }
	);

	res.status(200).json({ token });
}
