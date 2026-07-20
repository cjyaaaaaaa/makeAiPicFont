import { storeToRefs } from 'pinia'

export const usePromptTemplates = () => {
	const { locale } = useAppI18n()
	const store = useAiTemplateStore()
	const { activeCategory, activeCards, categoriesLoading, templatesLoading, error, tabs } = storeToRefs(store)

	callOnce('ai-template-categories', () => store.fetchCategories()).catch(() => undefined)
	watch(locale, () => store.fetchCategories(true).catch(() => undefined))

	return {
		activeCategory,
		tabs,
		activeCards,
		categoriesLoading,
		templatesLoading,
		error,
		selectCategory: store.selectCategory,
	}
}
