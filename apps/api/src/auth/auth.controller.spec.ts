import { Test, TestingModule } from "@nestjs/testing";
import { PrismaService } from "@/prisma/prisma.service.js";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

describe("AuthController", () => {
	let authController: AuthController;

	const prismaMock = {
		user: {
			create: vi.fn(async ({ data }) => ({
				id: "7b0f1c1e-5d0b-4f0e-9a43-3a1f7a3b2c11",
				createdAt: new Date(),
				updatedAt: new Date(),
				...data,
			})),
		},
	};

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [
				AuthService,
				{ provide: PrismaService, useValue: prismaMock },
			],
		}).compile();

		authController = app.get(AuthController);
	});

	describe("register", () => {
		it("returns the created user without the password hash", async () => {
			const dto = {
				fullName: "Ann Lee",
				email: "ann@example.com",
				password: "12345678",
			};
			const result = await authController.register(dto);
			expect(result).toEqual({
				id: expect.any(String),
				fullName: dto.fullName,
				email: dto.email,
			});
			expect(result).not.toHaveProperty("passwordHash");
		});
	});
});
