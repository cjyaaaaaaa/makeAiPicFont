import zh from '~/utils/locales/zh.json'
import en from '~/utils/locales/en.json'
import de from '~/utils/locales/de.json'
import es from '~/utils/locales/es.json'
import ja from '~/utils/locales/ja.json'

type LocaleKey = 'zh' | 'en' | 'de' | 'es' | 'ja'
type Messages = Record<string, any>

const messages: Record<LocaleKey, Messages> = {
	zh,
	en,
	de,
	es,
	ja,
}

const state = reactive({
	locale: 'zh' as LocaleKey,
	messages,
})

const translate = (key: string, params?: Record<string, string | number>) => {
	const parts = key.split('.')
	let current: any = state.messages[state.locale]
	for (const part of parts) {
		current = current?.[part]
	}
	if (current === undefined && state.locale !== 'en') {
		current = state.messages.en
		for (const part of parts) {
			current = current?.[part]
		}
	}
	if (typeof current !== 'string') return current ?? key
	if (!params) return current
	return current.replace(/\{(\w+)\}/g, (_, name) => {
		const value = params[name]
		return value === undefined || value === null ? `{${name}}` : String(value)
	})
}

export const useI18n = () => {
	const t = (key: string, params?: Record<string, string | number>) => translate(key, params)
	const locale = computed(() => state.locale)
	const setLocale = (nextLocale: LocaleKey) => {
		state.locale = nextLocale
		if (process.client) {
			document.documentElement.lang = nextLocale
		}
	}

	return { t, locale, setLocale }
}
