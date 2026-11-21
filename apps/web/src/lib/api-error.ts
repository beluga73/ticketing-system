import axios from "axios";

type ApiErrorBody = {
	statusCode?: number;
	message?: string | string[];
	error?: string;
};

export type ApiError = {
	/** HTTP status, or 0 when the server could not be reached. */
	status: number;
	message: string;
};

const FALLBACK = "Something went wrong. Please try again.";

/** Turns anything thrown by `api` into a status and a message we can show. */
export function getApiError(err: unknown): ApiError {
	if (!axios.isAxiosError<ApiErrorBody>(err)) {
		return { status: 0, message: FALLBACK };
	}
	if (!err.response) {
		return {
			status: 0,
			message: "Can't reach the server. Check your connection and try again.",
		};
	}

	const { status, data } = err.response;
	// Nest sends `message` as a string, or an array for validation errors
	const message = Array.isArray(data?.message)
		? data.message.join(" ")
		: data?.message;

	return { status, message: message ?? FALLBACK };
}
