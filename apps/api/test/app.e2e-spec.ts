import {
	type INestApplication,
	StandardSchemaValidationPipe,
} from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types.js";
import { AppModule } from "./../src/app.module.js";

describe("Auth (e2e)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		app.setGlobalPrefix("api");
		app.useGlobalPipes(new StandardSchemaValidationPipe());
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it("POST /api/auth/register creates a user", () => {
		return request(app.getHttpServer())
			.post("/api/auth/register")
			.send({
				fullName: "Ann Lee",
				email: "ann@example.com",
				password: "12345678",
			})
			.expect(201)
			.expect({ fullName: "Ann Lee", email: "ann@example.com" });
	});

	it("POST /api/auth/register rejects an invalid body", () => {
		return request(app.getHttpServer())
			.post("/api/auth/register")
			.send({ fullName: "A", email: "nope", password: "123" })
			.expect(400);
	});
});
