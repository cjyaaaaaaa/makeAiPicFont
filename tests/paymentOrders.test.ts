import { describe, expect, it } from 'vitest'
import {
	formatOrderAmount,
	formatOrderDate,
	getBillingTypeKey,
	getOrderStatus,
	getPageCount,
	getVisibleRange,
} from '../utils/paymentOrders'

describe('payment order presentation', () => {
	it('formats cents using the supplied currency', () => {
		expect(formatOrderAmount(1599, 'USD', 'en')).toBe('$15.99')
	})

	it('maps known and unknown statuses', () => {
		expect(getOrderStatus('success')).toEqual({ key: 'success', tone: 'success' })
		expect(getOrderStatus('created')).toEqual({ key: 'created', tone: 'pending' })
		expect(getOrderStatus('failed')).toEqual({ key: 'failed', tone: 'failed' })
		expect(getOrderStatus('refunded')).toEqual({ key: 'refunded', tone: 'neutral' })
	})

	it('normalizes billing types', () => {
		expect(getBillingTypeKey('one_time')).toBe('one_time')
		expect(getBillingTypeKey('ONE-TIME')).toBe('one_time')
		expect(getBillingTypeKey('subscription')).toBe('subscription')
		expect(getBillingTypeKey('unknown')).toBe('unknown')
	})

	it('formats missing dates as an em dash', () => {
		expect(formatOrderDate(null, 'en')).toBe('—')
		expect(formatOrderDate('', 'zh')).toBe('—')
	})
})

describe('payment order pagination', () => {
	it('calculates page count with at least one page', () => {
		expect(getPageCount(24, 10)).toBe(3)
		expect(getPageCount(0, 10)).toBe(1)
	})

	it('calculates the visible result range', () => {
		expect(getVisibleRange(2, 10, 24, 10)).toEqual({ start: 11, end: 20 })
		expect(getVisibleRange(1, 10, 0, 0)).toEqual({ start: 0, end: 0 })
	})
})
