import { zodResolver } from "@hookform/resolvers/zod";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { Link } from "react-router";
import * as z from "zod";
import { BrandPanel } from "@/components/brand-panel";
import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
	Field,
	FieldDescription,
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
import { buildUrl } from "@/lib/api";
import { useAuth } from "@/stores/auth-store";

const formSchema = z
	.object({
		fullName: z.string().min(2, "Enter your full name.").or(z.literal("")),
		email: z.email("Enter a valid email address."),
		password: z.string().min(8, "Use at least 8 characters."),
		confirmPassword: z.string(),
		terms: z.boolean().refine((value) => value, {
			message: "You need to accept the terms to continue.",
		}),
	})
	.refine((data) => data.password === data.confirmPassword, {
		path: ["confirmPassword"],
		message: "Passwords don't match.",
	});

type FormValues = z.infer<typeof formSchema>;

const fieldClass =
	"h-11 border-foreground/25 bg-secondary px-3.5 dark:bg-secondary";

export default function SignUp() {
	const [showPassword, setShowPassword] = useState(false);
	const setAuth = useAuth((state) => state.setAuth);

	const form = useForm<FormValues>({
		resolver: zodResolver(formSchema),
		defaultValues: {
			fullName: "",
			email: "",
			password: "",
			confirmPassword: "",
			terms: false,
		},
		mode: "onBlur",
	});

	const onSubmit = async (values: FormValues) => {
		const url = buildUrl("/auth/sign-up");
		try {
			const res = await fetch(url, {
				method: "POST",
				credentials: "include",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({
					fullName: values.fullName || undefined,
					email: values.email,
					password: values.password,
				}),
			});
			const data = await res.json();
			setAuth(data.user, data.accessToken);
		} catch (err) {
			console.log(err);
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
								Create your account
							</h1>
							<p className="text-sm text-muted-foreground">
								One account for every drop. It takes a minute.
							</p>
						</div>

						<form id="sign-up-form" onSubmit={form.handleSubmit(onSubmit)}>
							<FieldGroup className="gap-5">
								<Controller
									name="fullName"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="sign-up-full-name">
												Full name
											</FieldLabel>
											<Input
												{...field}
												id="sign-up-full-name"
												className={fieldClass}
												autoComplete="name"
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="email"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="sign-up-email">Email</FieldLabel>
											<Input
												{...field}
												id="sign-up-email"
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
											<FieldLabel htmlFor="sign-up-password">
												Password
											</FieldLabel>
											<InputGroup className="h-11 border-foreground/25 bg-secondary dark:bg-secondary">
												<InputGroupInput
													{...field}
													id="sign-up-password"
													type={showPassword ? "text" : "password"}
													className="h-full px-3.5"
													autoComplete="new-password"
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
											<FieldDescription className="text-xs">
												At least 8 characters.
											</FieldDescription>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="confirmPassword"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field data-invalid={fieldState.invalid}>
											<FieldLabel htmlFor="sign-up-confirm-password">
												Confirm password
											</FieldLabel>
											<Input
												{...field}
												id="sign-up-confirm-password"
												type={showPassword ? "text" : "password"}
												className={fieldClass}
												autoComplete="new-password"
												aria-invalid={fieldState.invalid}
											/>
											{fieldState.invalid && (
												<FieldError errors={[fieldState.error]} />
											)}
										</Field>
									)}
								/>

								<Controller
									name="terms"
									control={form.control}
									render={({ field, fieldState }) => (
										<Field
											orientation="horizontal"
											data-invalid={fieldState.invalid}
										>
											<Checkbox
												id="sign-up-terms"
												checked={field.value}
												onCheckedChange={field.onChange}
												onBlur={field.onBlur}
												aria-invalid={fieldState.invalid}
											/>
											<FieldLabel
												htmlFor="sign-up-terms"
												className="font-normal text-muted-foreground"
											>
												I agree to the terms of sale and the privacy policy.
											</FieldLabel>
										</Field>
									)}
								/>

								<Button type="submit" size="lg" className="h-11 w-full text-sm">
									Create account
								</Button>
							</FieldGroup>
						</form>

						<p className="mt-8 text-center text-sm text-muted-foreground">
							Already have an account?{" "}
							<Link
								to="/sign-in"
								className="font-semibold text-primary underline underline-offset-4"
							>
								Log in
							</Link>
						</p>
					</div>
				</main>
			</div>

			<BrandPanel
				className="hidden lg:flex"
				title="Your seat, held while you pay."
				description="Pick seats, check out within 10 minutes, and find every ticket in one place."
			/>
		</div>
	);
}
