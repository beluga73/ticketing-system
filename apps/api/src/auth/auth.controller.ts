import { Public } from "@nestjs/authentication";
import {
	Body,
	Controller,
	Cookies,
	Headers,
	HttpCode,
	Post,
	Res,
} from "@nestjs/common";

import { HttpAdapterHost } from "@nestjs/core";
import {
	RefreshResponseDto,
	refreshResponseSchema,
	type SignInRequestDto,
	type SignInResponseDto,
	type SignUpRequestDto,
	type SignUpResponseDto,
	signInRequestSchema,
	signInResponseSchema,
	signUpRequestSchema,
	signUpResponseSchema,
} from "@repo/shared";
import type { Response } from "express";
import { AuthService, REFRESH_TTL_MS } from "./auth.service.js";

@Public()
@Controller("auth")
export class AuthController {
	constructor(
		private readonly authService: AuthService,
		private readonly adapterHost: HttpAdapterHost,
	) {}

	@Public()
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

	@Public()
	@Post("sign-in")
	@HttpCode(200)
	async signIn(
		@Body({ schema: signInRequestSchema }) dto: SignInRequestDto,
		@Res({ passthrough: true }) res: Response,
	): Promise<SignInResponseDto> {
		const { user, accessToken, refreshToken } =
			await this.authService.signIn(dto);

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

		return signInResponseSchema.parse({ user, accessToken });
	}

	@Public()
	@Post("refresh")
	@HttpCode(200)
	async refresh(
		@Cookies("refresh_token") refreshToken: string,
	): Promise<RefreshResponseDto> {
		const data = await this.authService.refresh(refreshToken);

		return refreshResponseSchema.parse(data);
	}
}
