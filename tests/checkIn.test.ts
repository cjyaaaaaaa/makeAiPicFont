import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

describe('daily check-in integration', () => {
	it('posts the check-in request and refreshes the user profile', () => {
		const apiSource = readFileSync(
			fileURLToPath(new URL('../api/user/index.ts', import.meta.url)),
			'utf8',
		)
		const pricingSource = readFileSync(
			fileURLToPath(new URL('../pages/pricing.vue', import.meta.url)),
			'utf8',
		)

		expect(apiSource).toContain("request<ApiResponse<CustomerCheckIn>>('/user/check-in'")
		expect(apiSource).toContain("method: 'POST'")
		expect(pricingSource).toContain('await executeDailyCheckIn()')
		expect(pricingSource).toContain('await loadUser()')
	})

	it('uses the profile checkedInToday flag as the button state', () => {
		const pricingSource = readFileSync(
			fileURLToPath(new URL('../pages/pricing.vue', import.meta.url)),
			'utf8',
		)

		expect(pricingSource).toContain(
			'const checkedInToday = computed(() => Boolean(user.value?.checkedInToday));',
		)
		expect(pricingSource).not.toContain('gptpix-check-in:')
	})
})
