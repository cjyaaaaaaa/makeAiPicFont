import {
	FALLBACK_TEMPLATE_TABS,
	hydrateTemplateTabs,
	type TemplateCard,
	type TemplateTab,
	type TemplateTabId,
} from '~/utils/promptTemplates'

export const usePromptTemplates = () => {
	const { t } = useAppI18n()
	const activeCategory = ref<TemplateTabId>('people')

	const tabs = computed<TemplateTab[]>(() => {
		const copy = t('home.promptTemplates.tabs') as typeof FALLBACK_TEMPLATE_TABS
		const source = Array.isArray(copy) && copy.length ? copy : FALLBACK_TEMPLATE_TABS
		return hydrateTemplateTabs(source)
	})

	const activeCards = computed<TemplateCard[]>(() => {
		return tabs.value.find(tab => tab.id === activeCategory.value)?.cards ?? tabs.value[0]?.cards ?? []
	})

	return {
		activeCategory,
		tabs,
		activeCards,
	}
}
