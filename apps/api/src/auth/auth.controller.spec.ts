import { Test, TestingModule } from "@nestjs/testing";
import { UsersService } from "@/users/users.service.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

describe("AuthController", () => {
	let authController: AuthController;

	const usersMock = {
		create: vi.fn(async (data) => ({
			id: "7b0f1c1e-5d0b-4f0e-9a43-3a1f7a3b2c11",
			createdAt: new Date(),
			updatedAt: new Date(),
			...data,
		})),
		findByEmail: vi.fn(),
	};

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [AuthService, { provide: UsersService, useValue: usersMock }],
		}).compile();

		authController = app.get(AuthController);
	});

	describe("signUp", () => {
		it("returns the created user without the password hash", async () => {
			const dto = {
				fullName: "Ann Lee",
				email: "ann@example.com",
				password: "12345678",
			};
			const result = await authController.signUp(dto);
			expect(result).toEqual({
				id: expect.any(String),
				fullName: dto.fullName,
				email: dto.email,
			});
			expect(result).not.toHaveProperty("passwordHash");
			expect(usersMock.create).toHaveBeenCalledWith(
				expect.not.objectContaining({ password: expect.anything() }),
			);
		});
	});
});
