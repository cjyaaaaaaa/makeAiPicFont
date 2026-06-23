import { $fetch } from 'ofetch'
export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()

	const request = $fetch.create({
		baseURL: config.public.baseURL,
		headers: {
			'Content-Type': 'application/json',
		},
		onRequest({ options }) {
			const token = import.meta.client
				? localStorage.getItem('token')
				: useCookie<string | null>('token').value ?? null

			if (token) {
				options.headers = {
					...options.headers,
					Authorization: `Bearer ${token}`,
				}
			}
		},
	})

	return {
		provide: {
			request,
		},
	}
})
