import { createHash, randomBytes } from "node:crypto";
import { DatabaseSync } from "node:sqlite";
import { PasswordHasher, TokenService } from "@nestjs/authentication";
import {
	ForbiddenException,
	Injectable,
	UnauthorizedException,
} from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service.js";
import { UsersService } from "@/users/users.service.js";
import type { SignInRequestDto, SignUpRequestDto } from "./dto/auth.dto.js";

export const REFRESH_TTL_MS = 14 * 24 * 60 * 60 * 1000; // 14 days

const hash = (refreshToken: string) =>
	createHash("sha256").update(refreshToken).digest("hex");

@Injectable()
export class AuthService {
	constructor(
		private readonly prisma: PrismaService,
		private readonly users: UsersService,
		private readonly passwordHasher: PasswordHasher,
		private readonly tokens: TokenService,
	) {}

	private async createTokens(
		userId: string,
	): Promise<{ accessToken: string; refreshToken: string }> {
		const { accessToken } = await this.tokens.issue(userId);
		const refreshToken = randomBytes(32).toString("base64url");
		const tokenHash = hash(refreshToken);
		const expiresAt = new Date(Date.now() + REFRESH_TTL_MS);

		await this.prisma.refreshToken.create({
			data: {
				tokenHash,
				userId,
				expiresAt,
			},
		});

		return { accessToken, refreshToken };
	}

	async signUp({ password, ...rest }: SignUpRequestDto) {
		const passwordHash = await this.passwordHasher.hash(password);
		const user = await this.users.create({ ...rest, passwordHash });

		const tokens = await this.createTokens(user.id);

		return { user, ...tokens };
	}

	async signIn(dto: SignInRequestDto) {
		const user = await this.users.findByEmail(dto.email);

		const valid = await this.passwordHasher.verify(
			dto.password,
			user?.passwordHash,
		);
		if (!user || !valid) throw new UnauthorizedException("Invalid credentials");

		const tokens = await this.createTokens(user.id);

		return { user, ...tokens };
	}

	async refresh(refreshToken: string) {
		const { expiresAt, user } =
			(await this.prisma.refreshToken.findUnique({
				where: {
					tokenHash: hash(refreshToken),
				},
				select: {
					expiresAt: true,
					user: { select: { id: true, email: true, fullName: true } },
				},
			})) ?? {};

		if (!user || !expiresAt || expiresAt.getTime() < Date.now()) {
			throw new ForbiddenException("refresh token is expired");
		}

		const { accessToken } = await this.tokens.issue(user.id);

		return { user, accessToken };
	}
}
