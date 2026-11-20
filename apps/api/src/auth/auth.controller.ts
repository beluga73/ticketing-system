import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import {
	type LoginRequestDto,
	type LoginResponseDto,
	loginRequestSchema,
	loginResponseSchema,
	type RegisterRequestDto,
	type RegisterResponseDto,
	registerRequestSchema,
	registerResponseSchema,
} from "./dto/auth.dto.js";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	async register(
		@Body({ schema: registerRequestSchema }) dto: RegisterRequestDto,
	): Promise<RegisterResponseDto> {
		const user = await this.authService.register(dto);
		return registerResponseSchema.parse(user);
	}

	@Post("login")
	async login(
		@Body({ schema: loginRequestSchema }) dto: LoginRequestDto,
	): Promise<LoginResponseDto> {
		const user = await this.authService.login(dto);
		return loginResponseSchema.parse(user);
	}
}
