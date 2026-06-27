import { $fetch } from 'ofetch'

const SITE = 'gptpix.ai'

export default defineNuxtPlugin(() => {
	const config = useRuntimeConfig()
	const { locale, t } = useAppI18n()
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
			const stateToken = useState<string | null>('user.token', () => null)
			const token = import.meta.client
				? stateToken.value ?? localStorage.getItem('token') ?? useCookie<string | null>('token').value
				: stateToken.value ?? useCookie<string | null>('token').value ?? null
			const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData

			options.headers = {
				...options.headers,
				'X-site': SITE,
				'Accept-Language': locale.value,
			}

			if (isFormData) {
				const headers = { ...options.headers } as Record<string, string | undefined>
				delete headers['Content-Type']
				delete headers['content-type']
				options.headers = headers
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
				![0, 200].includes(Number(data.code))
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
