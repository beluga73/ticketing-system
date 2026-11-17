import { Injectable } from "@nestjs/common";
import type { RegisterDto } from "./dto/auth.dto.js";

@Injectable()
export class AuthService {
	register(dto: RegisterDto) {
		// TODO: hash the password and save the user
		return { email: dto.email, fullName: dto.fullName };
	}
}
