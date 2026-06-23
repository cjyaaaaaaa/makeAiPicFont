export type TipToastType = 'success' | 'error' | 'info'

export type TipToastPayload = {
	title: string
	message?: string
	type?: TipToastType
	duration?: number
}

const tipToast = ref<{ show: (payload: TipToastPayload) => void } | null>(null)

export const useTipToast = () => {
	const registerTipToast = (instance: { show: (payload: TipToastPayload) => void } | null) => {
		tipToast.value = instance
	}

	const showTipToast = (payload: TipToastPayload) => {
		tipToast.value?.show(payload)
	}

	return {
		registerTipToast,
		showTipToast,
	}
}
