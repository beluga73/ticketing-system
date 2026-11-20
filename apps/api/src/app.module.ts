import { AuthenticationModule } from "@nestjs/authentication";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AuthModule } from "./auth/auth.module.js";
import { PrismaModule } from "./prisma/prisma.module.js";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		AuthenticationModule.forRoot({
			accessToken: {
				key: process.env.JWT_SECRET!,
				issuer: "dropline-api",
				audience: "dropline-web",
				ttl: "15m",
			},
			refreshToken: false,
		}),
		PrismaModule,
		AuthModule,
	],
})
export class AppModule {}
