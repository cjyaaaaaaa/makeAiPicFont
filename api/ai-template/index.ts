export type AiTemplateMediaType = 'image' | 'video'

export interface ApiResponse<T> {
	code: number | string
	msg?: string
	data: T
}

export interface SystemAiTemplateCategory {
	categoryId: number | string
	categoryName: string
	mediaType: AiTemplateMediaType
	sortOrder: number
}

export interface SystemAiTemplateItem {
	templateId: number | string
	categoryId: number | string
	templateName: string
	mediaType: AiTemplateMediaType
	prompt: string
	coverUrl: string[] | string
	sortOrder: number
	categoryName: string
}

export interface SystemAiTemplateList {
	total: number
	rows: SystemAiTemplateItem[]
}

export const getSystemAiTemplateCategories = async (mediaType: AiTemplateMediaType = 'image') => {
	const request = useRequest()
	const response = await request<ApiResponse<SystemAiTemplateCategory[]>>(
		'/ai/template/system/category/list',
		{ query: { mediaType } },
	)
	return response.data ?? []
}

export const getSystemAiTemplates = async (categoryId: number | string, pageSize = 5) => {
	const request = useRequest()
	const response = await request<ApiResponse<SystemAiTemplateList>>(
		'/ai/template/system/list',
		{ query: { pageNum: 1, pageSize, categoryId } },
	)
	return response.data ?? { total: 0, rows: [] }
}
