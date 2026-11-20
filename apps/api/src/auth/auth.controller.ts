import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import {
	type SignInRequestDto,
	type SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
	signInRequestSchema,
	signInResponseSchema,
	signUpRequestSchema,
	signUpResponseSchema,
} from "./dto/auth.dto.js";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("sign-up")
	async signUp(
		@Body({ schema: signUpRequestSchema }) dto: SignUpRequestDto,
	): Promise<SignUpResponseDto> {
		const user = await this.authService.signUp(dto);
		return signUpResponseSchema.parse(user);
	}

	@Post("sign-in")
	async signIn(
		@Body({ schema: signInRequestSchema }) dto: SignInRequestDto,
	): Promise<SignInResponseDto> {
		const user = await this.authService.signIn(dto);
		return signInResponseSchema.parse(user);
	}
}
