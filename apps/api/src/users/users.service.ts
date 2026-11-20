import { ConflictException, Injectable } from "@nestjs/common";
import { Prisma } from "@/generated/prisma/client.js";
import { PrismaService } from "@/prisma/prisma.service.js";
import { UserDto } from "./dto/user.dto.js";

type CreateUserInput = Pick<
	Prisma.UserCreateInput,
	"email" | "fullName" | "passwordHash"
>;

type UserId = UserDto["id"];
type UpdateUserInput = Pick<UserDto, "email" | "fullName">;

@Injectable()
export class UsersService {
	constructor(private prisma: PrismaService) {}

	async create(data: CreateUserInput) {
		try {
			return await this.prisma.user.create({ data });
		} catch (error) {
			if (
				error instanceof Prisma.PrismaClientKnownRequestError &&
				error.code === "P2002"
			) {
				throw new ConflictException("Email already in use");
			}
			throw error;
		}
	}

	update(id: UserId, data: Partial<UpdateUserInput>) {
		return this.prisma.user.update({
			where: { id },
			data: { ...data },
		});
	}

	findById(id: string) {
		return this.prisma.user.findUnique({ where: { id } });
	}

	findByEmail(email: string) {
		return this.prisma.user.findUnique({ where: { email } });
	}
}
