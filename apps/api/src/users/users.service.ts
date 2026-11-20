import { Injectable } from "@nestjs/common";
import { PrismaService } from "@/prisma/prisma.service.js";

type CreateUserInput = {
	email: string;
	fullName?: string;
	passwordHash: string;
};

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	create(data: CreateUserInput) {
		return this.prisma.user.create({ data });
	}

	findByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } });
	}
}
