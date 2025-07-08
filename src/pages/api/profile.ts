/* import type { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const authHeader = req.headers.authorization;
	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return res
			.status(401)
			.json({ error: "Missing or invalid authorization header" });
	}

	const token = authHeader.split(" ")[1];

	try {
		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			userId: string;
			email: string;
		};
		res.status(200).json({ message: "Access granted", user: decoded });
	} catch (err) {
		res.status(401).json({ error: "Invalid or expired token" });
	}
}
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
