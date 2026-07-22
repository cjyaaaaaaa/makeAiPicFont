export type PaymentReturnState = 'success' | 'cancelled'

export const buildCheckoutReturnUrls = (origin: string, routePath: string) => {
	const pathname = new URL(routePath, origin).pathname

	return {
		checkoutSuccessUrl: new URL(`${pathname}?flag=true`, origin).toString(),
		checkoutCancelUrl: new URL(`${pathname}?flag=false`, origin).toString(),
	}
}

export const getSafeCheckoutUrl = (value: unknown) => {
	if (typeof value !== 'string' || !value) return null

	try {
		const url = new URL(value)
		return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null
	} catch {
		return null
	}
}

export const getPaymentReturnState = (flag: unknown): PaymentReturnState | null => {
	if (flag === 'true') return 'success'
	if (flag === 'false') return 'cancelled'
	return null
}

export const withoutPaymentFlag = <T extends Record<string, unknown>>(query: T) => {
	const { flag: _flag, ...rest } = query
	return rest
}
