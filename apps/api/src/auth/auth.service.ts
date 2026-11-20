import { Injectable, UnauthorizedException } from "@nestjs/common";
import { compare, hash } from "bcrypt";
import { UsersService } from "@/users/users.service.js";
import type { SignInRequestDto, SignUpRequestDto } from "./dto/auth.dto.js";

const BCRYPT_COST = 12;

@Injectable()
export class AuthService {
	constructor(private users: UsersService) {}

	async signUp({ password, ...rest }: SignUpRequestDto) {
		const passwordHash = await hash(password, BCRYPT_COST);
		return this.users.create({ ...rest, passwordHash });
	}

	async signIn(dto: SignInRequestDto) {
		const user = await this.users.findByEmail(dto.email);

		const valid = user && (await compare(dto.password, user.passwordHash));
		if (!valid) throw new UnauthorizedException("Invalid credentials");

		return user;
	}
}
