import { zodResolver } from "@hookform/resolvers/zod";
import type { SignInRequestDto, SignInResponseDto } from "@repo/shared";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router";
import * as z from "zod";
import { BrandPanel } from "@/components/brand-panel";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldError,
	FieldGroup,
	FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
} from "@/components/ui/input-group";
import { api } from "@/lib/api";
import { getApiError } from "@/lib/api-error";
import { useAuth } from "@/stores/auth-store";

const formSchema = z.object({
	email: z.email("Enter a valid email address."),
	password: z.string().min(1, "Enter your password."),
	remember: z.boolean(),
});

type FormValues = z.infer<typeof formSchema>;

const fieldClass =
	"h-11 border-foreground/25 bg-secondary px-3.5 dark:bg-secondary";

export default function Login() {
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(false);
	const setAuth = useAuth((state) => state.setAuth);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			email: "",
			password: "",
			remember: false,
		},
		mode: "onBlur",
	});

	const onSubmit: SubmitHandler<FormValues> = async (values) => {
		form.clearErrors("root");
		try {
			const body: SignInRequestDto = {
				email: values.email,
				password: values.password,
			};
			const { data } = await api.post<SignInResponseDto>("auth/sign-in", body);
			setAuth(data.user, data.accessToken);
			navigate("/");
		} catch (err) {
			const { status, message } = getApiError(err);
			form.setError("root.server", {
				message: status === 401 ? "Incorrect email or password." : message,
			});
		}
	};

	return (
		<div className="grid min-h-svh lg:grid-cols-2">
			<div className="flex flex-col">
				<header className="p-8 pb-0">
					<Logo />
				</header>

				<main className="flex flex-1 items-center justify-center px-4 pb-8">
					<div className="w-full max-w-sm">
						<div className="mb-8 space-y-2">
							<h1 className="max-w-64 font-heading text-4xl leading-[1.05] font-bold tracking-tight">
								Welcome back
							</h1>
							<p className="text-sm text-muted-foreground">
								Log in to see your tickets and pick seats.
							</p>
						</div>

						<form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
							<FieldGroup className="gap-5">
								<Controller
									name="email"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="login-email">Email</FieldLabel>
											<Input
												{...field}
												id="login-email"
												type="email"
												className={fieldClass}
												placeholder="you@example.com"
												autoComplete="email"
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="password"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<div className="flex items-center justify-between">
												<FieldLabel htmlFor="login-password">
													Password
												</FieldLabel>
												<Link
													to="/forgot-password"
													className="text-xs font-semibold text-primary underline underline-offset-4"
												>
													Forgot password?
												</Link>
											</div>
											<InputGroup className="h-11 border-foreground/25 bg-secondary dark:bg-secondary">
												<InputGroupInput
													{...field}
													id="login-password"
													type={showPassword ? "text" : "password"}
													className="h-full px-3.5"
													autoComplete="current-password"
													aria-invalid={fieldState.invalid}
												/>
												<InputGroupAddon align="inline-end">
													<InputGroupButton
														size="icon-xs"
														aria-label={
															showPassword ? "Hide password" : "Show password"
														}
														onClick={() => setShowPassword((shown) => !shown)}
													>
														{showPassword ? <EyeOff /> : <Eye />}
													</InputGroupButton>
												</InputGroupAddon>
											</InputGroup>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="remember"
									control={form.control}
									render={({ field }) => (
										<Field orientation="horizontal">
											<Checkbox
												id="login-remember"
												checked={field.value}
												onCheckedChange={field.onChange}
												onBlur={field.onBlur}
											/>
											<FieldLabel
												htmlFor="login-remember"
												className="font-normal text-muted-foreground"
											>
												Keep me logged in on this device
											</FieldLabel>
										</Field>
									)}
								/>

								{form.formState.errors.root?.server && (
									<FieldError errors={[form.formState.errors.root.server]} />
								)}

								<Button type="submit" size="lg" className="h-11 w-full text-sm">
									Log in
								</Button>
							</FieldGroup>
						</form>

						<p className="mt-8 text-center text-sm text-muted-foreground">
							New to Dropline?{" "}
							<Link
								to="/sign-up"
								className="font-semibold text-primary underline underline-offset-4"
							>
								Create an account
							</Link>
						</p>
					</div>
				</main>
			</div>

			<BrandPanel
				className="hidden lg:flex"
				title={
					<>
						Be in the room when
						<br />
						the drop opens.
					</>
				}
				description="Seats are held while you pay and never sold twice."
			/>
		</div>
	);
}
