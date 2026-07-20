import { defineStore } from 'pinia'
import {
	getSystemAiTemplateCategories,
	getSystemAiTemplates,
	type SystemAiTemplateCategory,
	type SystemAiTemplateItem,
} from '~/api/ai-template'
import type { TemplateCard, TemplateTab } from '~/utils/promptTemplates'

const CATEGORY_LIMIT = 5
const TEMPLATE_LIMIT = 5

const parseCoverUrls = (value: string[] | string | null | undefined): string[] => {
	if (Array.isArray(value)) return value.filter(Boolean)
	if (!value) return []

	try {
		const parsed = JSON.parse(value)
		if (Array.isArray(parsed)) return parsed.map(String).filter(Boolean)
	} catch {
		// Some API versions return a single URL instead of a JSON array.
	}

	return [value].filter(Boolean)
}

const toCard = (item: SystemAiTemplateItem): TemplateCard => ({
	id: String(item.templateId),
	title: item.templateName,
	alt: item.templateName,
	prompt: item.prompt || item.templateName,
	image: parseCoverUrls(item.coverUrl)[0] || '',
})

export const useAiTemplateStore = defineStore('ai-template', () => {
	const categories = ref<SystemAiTemplateCategory[]>([])
	const templatesByCategory = ref<Record<string, TemplateCard[]>>({})
	const activeCategory = ref('')
	const categoriesLoading = ref(false)
	const loadingCategoryIds = ref<string[]>([])
	const error = ref<string | null>(null)
	let categoriesRequest: Promise<void> | null = null
	const templateRequests = new Map<string, Promise<void>>()

	const tabs = computed<TemplateTab[]>(() => categories.value.map(category => ({
		id: String(category.categoryId),
		label: category.categoryName,
		cards: templatesByCategory.value[String(category.categoryId)] ?? [],
	})))
	const activeCards = computed(() => templatesByCategory.value[activeCategory.value] ?? [])
	const templatesLoading = computed(() => loadingCategoryIds.value.includes(activeCategory.value))

	async function fetchTemplates(categoryId: string, force = false) {
		if (!categoryId || (!force && templatesByCategory.value[categoryId])) return
		const pending = templateRequests.get(categoryId)
		if (pending) return pending

		const request = (async () => {
			loadingCategoryIds.value = [...new Set([...loadingCategoryIds.value, categoryId])]
			try {
				const data = await getSystemAiTemplates(categoryId, TEMPLATE_LIMIT)
				templatesByCategory.value[categoryId] = [...(data.rows ?? [])]
					.sort((a, b) => a.sortOrder - b.sortOrder)
					.slice(0, TEMPLATE_LIMIT)
					.map(toCard)
			} finally {
				loadingCategoryIds.value = loadingCategoryIds.value.filter(id => id !== categoryId)
				templateRequests.delete(categoryId)
			}
		})()

		templateRequests.set(categoryId, request)
		return request
	}

	async function selectCategory(categoryId: string) {
		activeCategory.value = categoryId
		await fetchTemplates(categoryId)
	}

	async function fetchCategories(force = false) {
		if (!force && categories.value.length) {
			if (!activeCategory.value) activeCategory.value = String(categories.value[0]?.categoryId ?? '')
			await fetchTemplates(activeCategory.value)
			return
		}
		if (categoriesRequest) return categoriesRequest

		categoriesRequest = (async () => {
			categoriesLoading.value = true
			error.value = null
			try {
				categories.value = (await getSystemAiTemplateCategories('image'))
					.filter(category => category.mediaType === 'image')
					.sort((a, b) => a.sortOrder - b.sortOrder)
					.slice(0, CATEGORY_LIMIT)
				const categoryExists = categories.value.some(
					category => String(category.categoryId) === activeCategory.value,
				)
				if (!categoryExists) activeCategory.value = String(categories.value[0]?.categoryId ?? '')
				await fetchTemplates(activeCategory.value, force)
			} catch (cause) {
				error.value = cause instanceof Error ? cause.message : 'Failed to load templates'
				throw cause
			} finally {
				categoriesLoading.value = false
				categoriesRequest = null
			}
		})()

		return categoriesRequest
	}

	return {
		categories,
		templatesByCategory,
		activeCategory,
		categoriesLoading,
		templatesLoading,
		error,
		tabs,
		activeCards,
		fetchCategories,
		fetchTemplates,
		selectCategory,
	}
})
