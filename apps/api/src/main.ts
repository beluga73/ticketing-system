import { StandardSchemaValidationPipe } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module.js";

async function bootstrap() {
	const app = await NestFactory.create(AppModule);
	app.setGlobalPrefix("api");
	app.enableCors({
		origin: app.get(ConfigService).getOrThrow<string>("CORS_ORIGIN"),
		credentials: true,
	});
	app.useGlobalPipes(new StandardSchemaValidationPipe());
	await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
