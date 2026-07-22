export type OrderStatusTone = 'success' | 'pending' | 'failed' | 'neutral'

export const formatOrderAmount = (
	amountCent: number,
	currency: string,
	locale: string,
) => new Intl.NumberFormat(locale, {
	style: 'currency',
	currency: currency || 'USD',
	minimumFractionDigits: 2,
}).format((Number(amountCent) || 0) / 100)

export const formatOrderDate = (
	value: string | null | undefined,
	locale: string,
) => {
	if (!value) return '—'
	const normalized = value.includes('T') ? value : value.replace(' ', 'T')
	const date = new Date(normalized)
	if (Number.isNaN(date.getTime())) return value
	return new Intl.DateTimeFormat(locale, {
		dateStyle: 'medium',
		timeStyle: 'short',
	}).format(date)
}

export const formatPlanId = (value: string | number | null | undefined) => {
	if (value === null || value === undefined) return '—'
	const text = String(value).trim()
	if (!text || text === 'null' || text === 'undefined') return '—'
	return text.startsWith('#') ? text : `#${text}`
}

export const getOrderStatus = (status: string) => {
	const key = status || 'unknown'
	const tones: Record<string, OrderStatusTone> = {
		success: 'success',
		created: 'pending',
		failed: 'failed',
	}
	return { key, tone: tones[key] || 'neutral' }
}

export type BillingTypeKey = 'one_time' | 'subscription' | 'unknown'

export const getBillingTypeKey = (value: string | null | undefined): BillingTypeKey => {
	const normalized = (value || '').trim().toLowerCase().replace(/[\s-]+/g, '_')
	if (normalized === 'one_time' || normalized === 'onetime') return 'one_time'
	if (normalized === 'subscription' || normalized === 'sub') return 'subscription'
	return 'unknown'
}

export const getPageCount = (total: number, pageSize: number) =>
	Math.max(1, Math.ceil(Math.max(0, total) / pageSize))

export const getVisibleRange = (
	page: number,
	pageSize: number,
	total: number,
	rowCount: number,
) => {
	if (total <= 0 || rowCount <= 0) return { start: 0, end: 0 }
	const start = (page - 1) * pageSize + 1
	return { start, end: Math.min(total, start + rowCount - 1) }
}
