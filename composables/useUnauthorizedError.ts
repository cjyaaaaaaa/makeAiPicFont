export const isUnauthorizedError = (error: unknown) => {
	const payload = error as {
		status?: number
		statusCode?: number
		statusMessage?: string
		message?: string
		data?: { code?: number | string; msg?: string; message?: string }
		response?: { status?: number; _data?: { code?: number | string; msg?: string; message?: string } }
	}
	const data = payload?.data ?? payload?.response?._data
	const status = Number(payload?.statusCode ?? payload?.status ?? payload?.response?.status ?? data?.code)
	const message = [
		payload?.statusMessage,
		payload?.message,
		data?.msg,
		data?.message,
	]
		.filter(Boolean)
		.join(' ')

	return status === 401 || /(^|\D)401(\D|$)|认证失败|无法访问系统资源|unauthori[sz]ed/i.test(message)
}
