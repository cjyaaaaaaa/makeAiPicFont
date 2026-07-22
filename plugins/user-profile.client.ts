export default defineNuxtPlugin((nuxtApp) => {
	const { clientProfileLoaded, initUser, logout } = useUser()

	nuxtApp.hook('app:mounted', async () => {
		if (clientProfileLoaded.value) return
		try {
			await initUser({ force: true })
		} catch {
			logout()
		}
	})
})
