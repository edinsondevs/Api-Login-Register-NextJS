/**
 * @file Este archivo contiene las pruebas unitarias para el endpoint de perfil de usuario.
 * @description Se utilizan mocks para simular las dependencias y probar la lógica del controlador de forma aislada.
 * @requires jest
 * @requires node-mocks-http
 */

import handler from "@/src/pages/api/profile";

import { createRequest, createResponse } from "node-mocks-http";
import { authenticate } from "@/middleware/auth";
import User from "@/src/models/User";

jest.mock("@/middleware/auth");
jest.mock("@/src/models/User");

/**
 * @description Suite de pruebas para el endpoint de perfil de usuario.
 * Contiene pruebas para diferentes escenarios de acceso al perfil.
 */
describe("GET /api/profile", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * @test {GET /api/profile}
	 * @description Debe devolver el perfil del usuario cuando se proporciona un token válido.
	 * @expected La respuesta debe tener un estado 200 y contener los datos del usuario.
	 */
	it("should return user profile for a valid token", async () => {
		const req = createRequest({
			method: "GET",
			headers: {
				authorization: "Bearer valid-token",
			},
		});
		const res = createResponse();

		(authenticate as jest.Mock).mockImplementation((req, res, next) => {
			req.user = { userId: "user-id" };
			next();
		});

		(User.findById as jest.Mock).mockReturnValue({
			select: jest
				.fn()
				.mockResolvedValue({
					name: "Test User",
					email: "test@example.com",
				}),
		});

		await handler(req, res);

		expect(res.statusCode).toBe(200);
		expect(res._getJSONData()).toEqual({
			user: { name: "Test User", email: "test@example.com" },
		});
	});

	/**
	 * @test {GET /api/profile}
	 * @description Debe devolver un error 401 si no se proporciona un token de autenticación.
	 * @expected La respuesta debe tener un estado 401 y un mensaje "Unauthorized".
	 */
	it("should return 401 for a missing token", async () => {
		const req = createRequest({
			method: "GET",
		});
		const res = createResponse();

		(authenticate as jest.Mock).mockImplementation((req, res, next) => {
			res.status(401).json({ error: "Unauthorized" });
		});

		await handler(req, res);

		expect(res.statusCode).toBe(401);
		expect(res._getJSONData()).toEqual({ error: "Unauthorized" });
	});

	/**
	 * @test {GET /api/profile}
	 * @description Debe devolver un error 401 si el token de autenticación es inválido.
	 * @expected La respuesta debe tener un estado 401 y un mensaje "Unauthorized".
	 */
	it("should return 401 for an invalid token", async () => {
		const req = createRequest({
			method: "GET",
			headers: {
				authorization: "Bearer invalid-token",
			},
		});
		const res = createResponse();

		(authenticate as jest.Mock).mockImplementation((req, res, next) => {
			res.status(401).json({ error: "Unauthorized" });
		});

		await handler(req, res);

		expect(res.statusCode).toBe(401);
		expect(res._getJSONData()).toEqual({ error: "Unauthorized" });
	});

	/**
	 * @test {GET /api/profile}
	 * @description Debe devolver un error 404 si el usuario asociado al token no se encuentra en la base de datos.
	 * @expected La respuesta debe tener un estado 404 y un mensaje "User not found".
	 */
	it("should return 404 if user is not found", async () => {
		const req = createRequest({
			method: "GET",
			headers: {
				authorization: "Bearer valid-token",
			},
		});
		const res = createResponse();

		(authenticate as jest.Mock).mockImplementation((req, res, next) => {
			req.user = { userId: "user-id" };
			next();
		});

		(User.findById as jest.Mock).mockReturnValue({
			select: jest.fn().mockResolvedValue(null),
		});

		await handler(req, res);

		expect(res.statusCode).toBe(404);
		expect(res._getJSONData()).toEqual({ error: "User not found" });
	});

	/**
	 * @test {GET /api/profile}
	 * @description Debe devolver un error 405 si la solicitud no es de tipo GET.
	 * @expected La respuesta debe tener un estado 405.
	 */
	it("should return 405 for non-GET requests", async () => {
		const req = createRequest({
			method: "POST",
		});
		const res = createResponse();

		await handler(req, res);

		expect(res.statusCode).toBe(405);
	});
});
