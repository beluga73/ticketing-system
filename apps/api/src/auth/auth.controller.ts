import { Public } from "@nestjs/authentication";
import { Body, Controller, HttpCode, Post, Res } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import type { Response } from "express";
import { AuthService, REFRESH_TTL_MS } from "./auth.service.js";
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

@Public()
@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly adapterHost: HttpAdapterHost,
	) {}

	@Post("sign-up")
	async signUp(
		@Body({ schema: signUpRequestSchema }) dto: SignUpRequestDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<SignUpResponseDto> {
		const { user, accessToken, refreshToken } =
			await this.authService.signUp(dto);

		this.adapterHost.httpAdapter.setCookie?.(
			res,
			"refresh_token",
			refreshToken,
			{
				httpOnly: true,
				secure: true,
				sameSite: "lax",
				path: "/api/auth/refresh",
				maxAge: REFRESH_TTL_MS / 1000,
			},
		);

		return signUpResponseSchema.parse({ user, accessToken });
	}

	@Post("sign-in")
	@HttpCode(200)
	async signIn(
		@Body({ schema: signInRequestSchema }) dto: SignInRequestDto,
	): Promise<SignInResponseDto> {
		const user = await this.authService.signIn(dto);
		return signInResponseSchema.parse(user);
	}
}
