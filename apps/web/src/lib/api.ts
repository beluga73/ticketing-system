export const buildUrl = (url: string) => {
	const newUrl = new URL(url, import.meta.env.BASE_URL);
	return newUrl.toString();
};
