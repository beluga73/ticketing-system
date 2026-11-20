import {
	AuthenticationRegistry,
	JwtBearerProvider,
	type JwtClaims,
} from "@nestjs/authentication";
import { Injectable } from "@nestjs/common";
import type { User } from "@/generated/prisma/client.js";
import { UsersService } from "@/users/users.service.js";

@Injectable()
export class JwtAuthProvider extends JwtBearerProvider<User> {
	constructor(
		private users: UsersService,
		registry: AuthenticationRegistry,
	) {
		super();
		registry.registerProvider(this);
	}
	validate({ sub }: JwtClaims) {
		return sub ? this.users.findById(sub) : null;
	}
}
