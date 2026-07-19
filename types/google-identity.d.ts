interface GoogleCredentialResponse {
	credential?: string
	select_by?: string
}

interface GoogleIdentityServices {
	accounts: {
		id: {
			initialize: (config: {
				client_id: string
				callback: (response: GoogleCredentialResponse) => void
				cancel_on_tap_outside?: boolean
				use_fedcm_for_prompt?: boolean
			}) => void
			prompt: () => void
			cancel: () => void
		}
	}
}

interface Window {
	google?: GoogleIdentityServices
}
