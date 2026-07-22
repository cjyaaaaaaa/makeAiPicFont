import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

const pricingSource = readFileSync(
	fileURLToPath(new URL('../pages/pricing.vue', import.meta.url)),
	'utf8',
)

describe('pricing subscription management', () => {
	it('uses the profile subscribed flag to show subscription management', () => {
		expect(pricingSource).toContain(
			'const subscribed = computed(() => Boolean(user.value?.subscribed));',
		)
		expect(pricingSource).toContain('t("pricing.manageSubscription")')
	})

	it('sends subscribed users to the localized current subscription tab', () => {
		expect(pricingSource).toContain('if (subscribed.value)')
		expect(pricingSource).toContain('await navigateTo(subscriptionPath.value)')
		expect(pricingSource).toContain('`/${localePrefix}/account/subscription`')
	})
})
