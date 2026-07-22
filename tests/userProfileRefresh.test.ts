import { existsSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'

describe('user profile refresh initialization', () => {
	it('reloads the signed-in user profile once the client app is mounted', () => {
		const pluginPath = fileURLToPath(new URL('../plugins/user-profile.client.ts', import.meta.url))

		expect(existsSync(pluginPath)).toBe(true)
		const pluginSource = readFileSync(pluginPath, 'utf8')
		expect(pluginSource).toContain("nuxtApp.hook('app:mounted'")
		expect(pluginSource).toContain('if (clientProfileLoaded.value) return')
		expect(pluginSource).toContain('await initUser({ force: true })')
	})
})
