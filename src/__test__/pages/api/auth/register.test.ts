/**
 * @file Este archivo contiene las pruebas unitarias para el endpoint de registro de usuarios.
 * @description Se utilizan mocks para simular las dependencias y probar la lógica del controlador de forma aislada.
 * @requires jest
 * @requires node-mocks-http
 */

import handler from '@/src/pages/api/auth/register';

import { createRequest, createResponse } from 'node-mocks-http';
import User from '@/src/models/User';
import bcrypt from 'bcryptjs';

jest.mock('@/src/models/User');
jest.mock('bcryptjs');

/**
 * @description Suite de pruebas para el endpoint de registro de usuarios.
 * Contiene pruebas para diferentes escenarios de registro.
 */
describe("POST /api/auth/register", () => {
	afterEach(() => {
		jest.clearAllMocks();
	});

	/**
	 * @test {POST /api/auth/register}
	 * @description Debe registrar un nuevo usuario con datos válidos.
	 * @expected La respuesta debe tener un estado 201 y devolver los datos del usuario registrado (nombre y email).
	 */
	it("should register a new user", async () => {
		const req = createRequest({
			method: "POST",
			body: {
				name: "Test User",
				email: "test@example.com",
				password: "password123",
			},
		});
		const res = createResponse();

		(User.findOne as jest.Mock).mockResolvedValue(null);
		(bcrypt.hash as jest.Mock).mockResolvedValue("hashedPassword");
		(User.create as jest.Mock).mockResolvedValue({
			name: "Test User",
			email: "test@example.com",
		});

		await handler(req, res);

		expect(res.statusCode).toBe(201);
		expect(res._getJSONData()).toEqual({
			success: true,
			user: {
				name: "Test User",
				email: "test@example.com",
			},
		});
	});

	/**
	 * @test {POST /api/auth/register}
	 * @description Debe devolver un error 409 si el email ya está en uso.
	 * @expected La respuesta debe tener un estado 409 y un mensaje "Email already in use".
	 */
	it("should return 409 if email is already in use", async () => {
		const req = createRequest({
			method: "POST",
			body: {
				name: "Test User",
				email: "test@example.com",
				password: "password123",
			},
		});
		const res = createResponse();

		(User.findOne as jest.Mock).mockResolvedValue({
			email: "test@example.com",
		});

		await handler(req, res);

		expect(res.statusCode).toBe(409);
		expect(res._getJSONData()).toEqual({ error: "Email already in use" });
	});

	/**
	 * @test {POST /api/auth/register}
	 * @description Debe devolver un error 400 si los datos de entrada son inválidos (ej. email mal formateado, contraseña muy corta).
	 * @expected La respuesta debe tener un estado 400 y contener errores de validación.
	 */
	it("should return 400 for invalid input", async () => {
		const req = createRequest({
			method: "POST",
			body: {
				name: "Test User",
				email: "invalid-email",
				password: "123",
			},
		});
		const res = createResponse();

		await handler(req, res);

		expect(res.statusCode).toBe(400);
	});

	/**
	 * @test {POST /api/auth/register}
	 * @description Debe devolver un error 405 si la solicitud no es de tipo POST.
	 * @expected La respuesta debe tener un estado 405.
	 */
	it("should return 405 for non-POST requests", async () => {
		const req = createRequest({
			method: "GET",
		});
		const res = createResponse();

		await handler(req, res);

		expect(res.statusCode).toBe(405);
	});
});
