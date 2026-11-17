import { Body, Controller, Post } from "@nestjs/common";
import { AuthService } from "./auth.service.js";
import { type RegisterDto, registerSchema } from "./dto/auth.dto.js";

@Controller("auth")
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Post("register")
	register(@Body({ schema: registerSchema }) dto: RegisterDto) {
		return this.authService.register(dto);
	}
}
