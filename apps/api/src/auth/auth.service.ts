import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare, hash } from "bcrypt";
import { PrismaService } from "@/prisma/prisma.service.js";
import type { LoginRequestDto, RegisterRequestDto } from "./dto/auth.dto.js";

const BCRYPT_COST = 12;

@Injectable()
export class AuthService {
	constructor(private prisma: PrismaService) {}

	async register(dto: RegisterRequestDto) {
		const passwordHash = await hash(dto.password, BCRYPT_COST);

		return this.prisma.user.create({
			data: {
				fullName: dto.fullName,
				email: dto.email,
				passwordHash,
			},
		});
	}

	async login(dto: LoginRequestDto) {
		const user = await this.prisma.user.findUnique({
			where: { email: dto.email },
		});

		const valid = user && (await compare(dto.password, user.passwordHash));
		if (!valid) throw new UnauthorizedException("Invalid credentials");

		return user;
	}
}
