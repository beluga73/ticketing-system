import { Test, TestingModule } from "@nestjs/testing";
import { AuthController } from "./auth.controller.js";
import { AuthService } from "./auth.service.js";

describe("AuthController", () => {
	let authController: AuthController;

	beforeEach(async () => {
		const app: TestingModule = await Test.createTestingModule({
			controllers: [AuthController],
			providers: [AuthService],
		}).compile();

		authController = app.get(AuthController);
	});

	describe("register", () => {
		it("returns the created user", () => {
			const dto = {
				fullName: "Ann Lee",
				email: "ann@example.com",
				password: "12345678",
			};
			expect(authController.register(dto)).toEqual({
				fullName: dto.fullName,
				email: dto.email,
			});
		});
	});
});
