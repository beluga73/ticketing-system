import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@/generated/prisma/client.js";

@Injectable()
export class PrismaService
	extends PrismaClient
	implements OnModuleInit, OnModuleDestroy
{
	constructor(config: ConfigService) {
		super({
			adapter: new PrismaPg({ connectionString: config.get("DATABASE_URL") }),
		});
	}
	onModuleInit() {
		return this.$connect();
	}
	onModuleDestroy() {
		return this.$disconnect();
	}
}
