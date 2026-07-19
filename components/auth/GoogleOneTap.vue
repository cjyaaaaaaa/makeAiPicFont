<script setup lang="ts">
import { thirdPartyLoginController } from '~/api/user'

const GOOGLE_CLIENT_ID =
	'1007188045137-69g86626b9559hr20bfg3qm7d9oprnfm.apps.googleusercontent.com'

const { t } = useAppI18n()
const { showTipToast } = useTipToast()
const { user, token, loginWithToken, logout } = useUser()

let disposed = false
let prompted = false

const loadGoogleScript = (): Promise<void> => {
	if (window.google?.accounts?.id) return Promise.resolve()

	return new Promise((resolve, reject) => {
		const existing = document.getElementById('google-gsi-script') as HTMLScriptElement | null
		if (existing) {
			const startedAt = Date.now()
			const timer = window.setInterval(() => {
				if (window.google?.accounts?.id) {
					window.clearInterval(timer)
					resolve()
				} else if (Date.now() - startedAt >= 8000) {
					window.clearInterval(timer)
					reject(new Error('Google Identity Services failed to load'))
				}
			}, 50)
			return
		}

		const script = document.createElement('script')
		script.id = 'google-gsi-script'
		script.src = 'https://accounts.google.com/gsi/client'
		script.async = true
		script.defer = true
		script.onload = () => resolve()
		script.onerror = () => reject(new Error('Google Identity Services failed to load'))
		document.head.appendChild(script)
	})
}

const handleCredential = async (response: GoogleCredentialResponse) => {
	if (!response.credential || disposed) return

	const authToken = await thirdPartyLoginController({
		provider: 'google',
		credential: response.credential,
	})

	if (!authToken) {
		showTipToast({
			type: 'error',
			title: t('auth.loginFailureTitle'),
			message: t('auth.loginFailureMessage'),
		})
		return
	}

	try {
		await loginWithToken(authToken)
		window.google?.accounts.id.cancel()
		showTipToast({
			type: 'success',
			title: t('auth.loginSuccessTitle'),
			message: t('auth.loginSuccessMessage'),
		})
	} catch {
		logout()
		showTipToast({
			type: 'error',
			title: t('auth.loginFailureTitle'),
			message: t('auth.loginFailureMessage'),
		})
	}
}

const showOneTap = async () => {
	if (prompted || disposed || token.value || user.value) return

	prompted = true
	try {
		await loadGoogleScript()
		if (disposed || token.value || user.value) return

		window.google?.accounts.id.initialize({
			client_id: GOOGLE_CLIENT_ID,
			callback: handleCredential,
			cancel_on_tap_outside: false,
			use_fedcm_for_prompt: false,
		})
		window.google?.accounts.id.prompt()
	} catch {
		// Google may be blocked or unavailable; the normal login UI remains usable.
	}
}

onMounted(() => {
	void showOneTap()
})

watch([token, user], ([currentToken, currentUser]) => {
	if (currentToken || currentUser) {
		window.google?.accounts?.id.cancel()
		return
	}
	void showOneTap()
})

onBeforeUnmount(() => {
	disposed = true
	window.google?.accounts?.id.cancel()
})
</script>
