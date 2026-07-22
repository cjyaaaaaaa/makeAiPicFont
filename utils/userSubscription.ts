export type SubscriptionStatusTone = 'active' | 'cancelled' | 'expired' | 'neutral'

const parseBackendDate = (value: string | null | undefined) => {
	if (!value) return null
	const normalized = value.includes('T') ? value : value.replace(' ', 'T')
	const date = new Date(normalized)
	return Number.isNaN(date.getTime()) ? null : date
}

export const getSubscriptionStatus = (status: string) => {
	const normalized = status === 'canceled' ? 'cancelled' : status || 'unknown'
	const tones: Record<string, SubscriptionStatusTone> = {
		active: 'active',
		cancelled: 'cancelled',
		expired: 'expired',
	}
	return { key: normalized, tone: tones[normalized] || 'neutral' }
}

export const getPeriodProgress = (
	periodStart: string | null | undefined,
	periodEnd: string | null | undefined,
	now = new Date(),
) => {
	const start = parseBackendDate(periodStart)
	const end = parseBackendDate(periodEnd)
	if (!start || !end || end.getTime() <= start.getTime()) return null
	const progress = ((now.getTime() - start.getTime()) / (end.getTime() - start.getTime())) * 100
	return Math.round(Math.min(100, Math.max(0, progress)))
}

export const getRemainingDays = (
	periodEnd: string | null | undefined,
	now = new Date(),
) => {
	const end = parseBackendDate(periodEnd)
	if (!end) return null
	return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000))
}

export const getSafePortalUrl = (value: unknown) => {
	if (typeof value !== 'string' || !value) return null
	try {
		const url = new URL(value)
		return ['http:', 'https:'].includes(url.protocol) ? url.toString() : null
	} catch {
		return null
	}
}
