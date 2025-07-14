// middleware/auth.ts
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export interface AuthenticatedRequest extends NextApiRequest {
	user?: { userId: string; email: string };
}

export function authenticate(
	req: AuthenticatedRequest,
	res: NextApiResponse,
	next: () => void
) {
	const authHeader = req.headers.authorization;
	if (!authHeader?.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ error: "Missing or invalid authorization header" });
	}

	const token = authHeader.split(" ")[1];

	const secret = process.env.JWT_SECRET;

	if (!secret) {
		console.error("JWT Secret is not defined in environment variables.");
		// Esto es un error de configuración del servidor, por lo que devolvemos un 500.
		return res.status(500).json({ error: "Internal Server Error" });
	}

	try {
		const decoded = jwt.verify(token, secret) as {
			userId: string;
			email: string;
		};
		req.user = decoded;
		next();
	} catch (err) {
		return res.status(401).json({ error: "Invalid or expired token" });
	}
}
