/**
 * @file Este archivo contiene las pruebas unitarias para el endpoint de login.
 * @description Se utilizan mocks para simular las dependencias y probar la lógica del controlador de forma aislada.
 * @requires jest
 * @requires node-mocks-http
 */

import type { NextApiRequest, NextApiResponse } from "next";

import handler from "../../../../pages/api/auth/login";
import User from "../../../../models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { loginSchema } from "../../../../schemas/userSchema";

// 1. MOCKING DE DEPENDENCIAS
// Hacemos un "mock" (simulacro) de todas las dependencias externas.
// Esto nos permite probar la lógica de nuestro handler de forma aislada.
jest.mock("../../../../lib/mongodb");
jest.mock("../../../../models/User");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("../../../../schemas/userSchema", () => ({
	loginSchema: {
		safeParse: jest.fn(),
	},
}));

// 2. HELPERS PARA SIMULAR REQUEST Y RESPONSE
// Función para crear un objeto de request simulado (mock)
const mockReq = (method: string, body: any) => {
	return {
		method,
		body,
	} as unknown as NextApiRequest;
};

// Función para crear un objeto de response simulado (mock)
const mockRes = () => {
	const res: any = {};
	// Simulamos las funciones que nuestro handler usa (status, json, end)
	// y las convertimos en "espías" de Jest (jest.fn()) para poder verificar si son llamadas.
	res.status = jest.fn().mockReturnValue(res);
	res.json = jest.fn().mockReturnValue(res);
	res.end = jest.fn().mockReturnValue(res);
	return res as NextApiResponse;
};

// 3. SUITE DE PRUEBAS PARA LA API DE LOGIN
/**
 * @description Suite de pruebas para el endpoint de login de usuarios.
 * Contiene pruebas para diferentes escenarios de autenticación.
 */
describe("/api/auth/login", () => {
	// Antes de cada prueba, limpiamos todos los mocks para asegurar
	// que el resultado de una prueba no afecte a la siguiente.
	beforeEach(() => {
		jest.clearAllMocks();
	});

	// --- CASOS DE PRUEBA ---

	/**
	 * @test {POST /api/auth/login}
	 * @description Debe devolver un error 405 si el método de la solicitud no es POST.
	 * @expected La respuesta debe tener un estado 405 y un mensaje "Method Not Allowed".
	 */
	it("Debe devolver un error 405 si el método no es POST", async () => {
		// Arrange: Preparamos la prueba creando un request GET.
		const req = mockReq("GET", {});
		const res = mockRes();

		// Act: Ejecutamos el handler.
		await handler(req, res);

		// Assert: Verificamos que la respuesta sea la esperada.
		expect(res.status).toHaveBeenCalledWith(405);
		expect(res.end).toHaveBeenCalledWith("Method Not Allowed");
	});

	/**
	 * @test {POST /api/auth/login}
	 * @description Debe devolver un error 400 si los datos de entrada son inválidos según el esquema de validación.
	 * @expected La respuesta debe tener un estado 400 y un objeto JSON con los errores de validación.
	 */
	it("Debe devolver un error 400 si los datos de entrada son inválidos", async () => {
		// Arrange: Simulamos que la validación de Zod falla con un error estructurado.
		const zodError = {
			flatten: () => ({
				fieldErrors: {
					email: ["Invalid email"],
					password: ["Required"],
				},
			}),
		};
		(loginSchema.safeParse as jest.Mock).mockReturnValue({
			success: false,
			error: zodError,
		});
		const req = mockReq("POST", { email: "invalido" });
		const res = mockRes();

		// Act
		await handler(req, res);

		// Assert
		expect(res.status).toHaveBeenCalledWith(400);
		expect(res.json).toHaveBeenCalledWith({
			errors: { email: ["Invalid email"], password: ["Required"] },
		});
	});

	/**
	 * @test {POST /api/auth/login}
	 * @description Debe devolver un error 401 si el usuario no existe en la base de datos.
	 * @expected La respuesta debe tener un estado 401 y un mensaje "Invalid credentials".
	 */
	it("Debe devolver un error 401 si el usuario no existe", async () => {
		// Arrange: Simulamos una validación exitosa pero que la BD no encuentra al usuario.
		(loginSchema.safeParse as jest.Mock).mockReturnValue({
			success: true,
			data: { email: "noexiste@test.com", password: "password" },
		});
		(User.findOne as jest.Mock).mockResolvedValue(null); // Simulamos que User.findOne devuelve null
		const req = mockReq("POST", {
			email: "noexiste@test.com",
			password: "password",
		});
		const res = mockRes();

		// Act
		await handler(req, res);

		// Assert
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
	});

	/**
	 * @test {POST /api/auth/login}
	 * @description Debe devolver un error 401 si la contraseña proporcionada es incorrecta para el usuario existente.
	 * @expected La respuesta debe tener un estado 401 y un mensaje "Invalid credentials".
	 */
	it("Debe devolver un error 401 si la contraseña es incorrecta", async () => {
		// Arrange: Simulamos que el usuario existe, pero la comparación de bcrypt falla.
		const fakeUser = {
			_id: "123",
			email: "test@test.com",
			password: "hashedPasswordCorrecto",
		};
		(loginSchema.safeParse as jest.Mock).mockReturnValue({
			success: true,
			data: { email: "test@test.com", password: "passwordIncorrecto" },
		});
		(User.findOne as jest.Mock).mockResolvedValue(fakeUser);
		(bcrypt.compare as jest.Mock).mockResolvedValue(false); // Simulamos que la contraseña no coincide
		const req = mockReq("POST", {
			email: "test@test.com",
			password: "passwordIncorrecto",
		});
		const res = mockRes();

		// Act
		await handler(req, res);

		// Assert
		expect(res.status).toHaveBeenCalledWith(401);
		expect(res.json).toHaveBeenCalledWith({ error: "Invalid credentials" });
	});

	/**
	 * @test {POST /api/auth/login}
	 * @description Debe devolver un token JWT y un estado 200 si el login es exitoso con credenciales válidas.
	 * @expected La respuesta debe tener un estado 200 y un objeto JSON que contenga el token JWT.
	 */
	it("Debe devolver un token 200 si el login es exitoso", async () => {
		// Arrange: Simulamos el "camino feliz": all funciona como se espera.
		const fakeUser = {
			_id: "123",
			email: "test@test.com",
			password: "hashedPasswordCorrecto",
		};
		(loginSchema.safeParse as jest.Mock).mockReturnValue({
			success: true,
			data: { email: "test@test.com", password: "passwordCorrecto" },
		});
		(User.findOne as jest.Mock).mockResolvedValue(fakeUser);
		(bcrypt.compare as jest.Mock).mockResolvedValue(true); // La contraseña coincide
		(jwt.sign as jest.Mock).mockReturnValue("fake-jwt-token"); // Devolvemos un token falso
		const req = mockReq("POST", {
			email: "test@test.com",
			password: "passwordCorrecto",
		});
		const res = mockRes();

		// Act
		await handler(req, res);

		// Assert
		expect(res.status).toHaveBeenCalledWith(200);
		expect(res.json).toHaveBeenCalledWith({ token: "fake-jwt-token" });
	});
});
