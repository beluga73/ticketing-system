import { createHash, randomBytes } from "node:crypto";
import { PasswordHasher, TokenService } from "@nestjs/authentication";
import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service.js";
import { UsersService } from "@/users/users.service.js";
import type { SignInRequestDto, SignUpRequestDto } from "./dto/auth.dto.js";

export const REFRESH_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly users: UsersService,
		private readonly passwordHasher: PasswordHasher,
		private readonly tokens: TokenService,
	) {}

	async signUp({ password, ...rest }: SignUpRequestDto) {
		const passwordHash = await this.passwordHasher.hash(password);
		const user = await this.users.create({ ...rest, passwordHash });
		const { accessToken } = await this.tokens.issue(user.id);
		const refreshToken = randomBytes(32).toString("base64url");

		const tokenHash = createHash("sha256").update(refreshToken).digest("hex");
		const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

		await this.prisma.refreshToken.create({
			data: {
				tokenHash,
				userId: user.id,
				expiresAt,
			},
		});

		return { user, accessToken, refreshToken };
	}

	async signIn(dto: SignInRequestDto) {
		const user = await this.users.findByEmail(dto.email);

		const valid = await this.passwordHasher.verify(
			dto.password,
			user?.passwordHash,
		);
		if (!valid) throw new UnauthorizedException("Invalid credentials");

		return user;
	}
}
