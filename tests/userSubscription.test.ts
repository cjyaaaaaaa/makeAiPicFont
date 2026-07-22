import { describe, expect, it } from 'vitest'
import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import {
	getPeriodProgress,
	getRemainingDays,
	getSafePortalUrl,
	getSubscriptionStatus,
} from '../utils/userSubscription'

describe('subscription status', () => {
	it('maps lifecycle statuses to visual tones', () => {
		expect(getSubscriptionStatus('active')).toEqual({ key: 'active', tone: 'active' })
		expect(getSubscriptionStatus('cancelled')).toEqual({ key: 'cancelled', tone: 'cancelled' })
		expect(getSubscriptionStatus('canceled')).toEqual({ key: 'cancelled', tone: 'cancelled' })
		expect(getSubscriptionStatus('expired')).toEqual({ key: 'expired', tone: 'expired' })
		expect(getSubscriptionStatus('paused')).toEqual({ key: 'paused', tone: 'neutral' })
	})
})

describe('subscription period', () => {
	it('calculates and clamps period progress', () => {
		expect(getPeriodProgress('2026-06-01 00:00:00', '2026-07-01 00:00:00', new Date('2026-06-16T00:00:00'))).toBe(50)
		expect(getPeriodProgress('2026-06-01 00:00:00', '2026-07-01 00:00:00', new Date('2026-05-01T00:00:00'))).toBe(0)
		expect(getPeriodProgress('2026-06-01 00:00:00', '2026-07-01 00:00:00', new Date('2026-08-01T00:00:00'))).toBe(100)
		expect(getPeriodProgress('bad', '2026-07-01 00:00:00')).toBeNull()
	})

	it('rounds remaining partial days up', () => {
		expect(getRemainingDays('2026-07-01 00:00:00', new Date('2026-06-29T12:00:00'))).toBe(2)
	})
})

describe('portal URL safety', () => {
	it('accepts only absolute HTTP and HTTPS URLs', () => {
		expect(getSafePortalUrl('https://billing.stripe.com/p/session/test')).toBe('https://billing.stripe.com/p/session/test')
		expect(getSafePortalUrl('/portal')).toBeNull()
		expect(getSafePortalUrl('javascript:alert(1)')).toBeNull()
	})
})

describe('subscription loading layout', () => {
	it('centers the loading grid within the subscription panel', () => {
		const componentPath = fileURLToPath(new URL('../components/home/app/AppAccountSubscriptionDashboard.vue', import.meta.url))
		const componentSource = readFileSync(componentPath, 'utf8')

		expect(componentSource).toMatch(/\.subscription-loading\{[^}]*justify-content:center/)
	})
})
