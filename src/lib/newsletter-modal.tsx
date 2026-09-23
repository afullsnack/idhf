

const STORAGE_KEY = `idhf:newsletter-modal`


export const updateNewsletterModalState = (value: 'close' | 'open') => {
	if (typeof window === "undefined") return;

	window.sessionStorage.setItem(STORAGE_KEY, value)
}

export const getNewsletterModalState = (): "close" | "open" => {
	if (typeof window === "undefined") return "open";

	return window.sessionStorage.getItem(STORAGE_KEY) as "close" | "open";
}


const JOINED_STORAGE_KEY = `idhf:newsletter-joined`

export const updateJoinedStorage = (value: "yes" | "no") => {
	if (typeof window === "undefined") return;

	window.localStorage.setItem(JOINED_STORAGE_KEY, value);
}

export const getJoinedStorage = (): "yes" | "no" => {
	if (typeof window === "undefined") return "no";
	const value = window.localStorage.getItem(JOINED_STORAGE_KEY);
	return value ? value as "yes" | "no" : "no";
}
