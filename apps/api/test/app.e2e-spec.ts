import {
	type INestApplication,
	StandardSchemaValidationPipe,
} from "@nestjs/common";
import { Test, type TestingModule } from "@nestjs/testing";
import request from "supertest";
import type { App } from "supertest/types.js";
import { AppModule } from "./../src/app.module.js";
import { PrismaService } from "./../src/prisma/prisma.service.js";

const prismaMock = {
	$connect: vi.fn(),
	$disconnect: vi.fn(),
	user: {
		create: vi.fn(async ({ data }) => ({
			id: "7b0f1c1e-5d0b-4f0e-9a43-3a1f7a3b2c11",
			...data,
		})),
	},
};

describe("Auth (e2e)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		})
			.overrideProvider(PrismaService)
			.useValue(prismaMock)
			.compile();

		app = moduleFixture.createNestApplication();
		app.setGlobalPrefix("api");
		app.useGlobalPipes(new StandardSchemaValidationPipe());
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it("POST /api/auth/sign-up creates a user", () => {
		return request(app.getHttpServer())
			.post("/api/auth/sign-up")
			.send({
				fullName: "Ann Lee",
				email: "ann@example.com",
				password: "12345678",
			})
			.expect(201)
			.expect(({ body }) => {
				expect(body).toEqual({
					id: expect.any(String),
					fullName: "Ann Lee",
					email: "ann@example.com",
				});
			});
	});

	it("POST /api/auth/sign-up rejects an invalid body", () => {
		return request(app.getHttpServer())
			.post("/api/auth/sign-up")
			.send({ fullName: "A", email: "nope", password: "123" })
			.expect(400);
	});
});
