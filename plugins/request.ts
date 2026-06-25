import { $fetch } from 'ofetch'

const SITE = 'gptpix.ai'

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const { locale, t } = useI18n()
	const { showTipToast } = useTipToast()

	const showGlobalRequestError = (message?: string) => {
		showTipToast({
			type: 'error',
			title: t('common.requestErrorTitle'),
			message: message || t('common.requestErrorMessage'),
		})
	}

	const request = $fetch.create({
		baseURL: config.public.baseURL,
		headers: {
			'Content-Type': 'application/json',
		},
		onRequest({ options }) {
			const token = import.meta.client
				? localStorage.getItem('token') ?? useCookie<string | null>('token').value
				: useCookie<string | null>('token').value ?? null

			options.headers = {
				...options.headers,
				'X-site': SITE,
				'Accept-Language': locale.value,
			}

			if (token) {
				options.headers = {
					...options.headers,
					Authorization: `Bearer ${token}`,
				}
			}
		},
		onResponse({ response }) {
			const data = response._data as
				| { code?: number; msg?: string; message?: string }
				| null
				| undefined

			if (
				response.status === 200 &&
				data &&
				typeof data === 'object' &&
				'code' in data &&
				data.code !== undefined &&
				data.code !== 200
			) {
				showGlobalRequestError(data.msg || data.message)
				throw createError({
					statusCode: response.status,
					statusMessage: data.msg || data.message || 'Request failed',
				})
			}
		},
		onResponseError({ response, error }) {
			showGlobalRequestError(
				(response?._data as { msg?: string; message?: string } | undefined)
					?.msg ||
					(response?._data as { msg?: string; message?: string } | undefined)
						?.message ||
					error?.message,
			)
		},
	})

	return {
		provide: {
			request,
		},
	}
})
