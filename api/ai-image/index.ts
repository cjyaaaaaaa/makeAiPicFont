export interface ApiResponse<T> {
	code: number | string
	msg?: string
	data: T
}

export interface GenerateImageData {
	traceId: string
	status?: string
	creditCost?: number
	remainingBalance?: number
}

export interface GenerateAiImagePayload {
	prompt: string
	images: string[]
	ratio: string
	resolution: string
	platformCode: number
	modelCode: number
	n: number
	quality?: 'low' | 'medium' | 'high'
}

export interface UploadFileData {
	url: string
	fileName?: string
	newFileName?: string
	directory?: string
	originalFilename?: string
	size?: number
}

export interface BatchUploadFileData {
	urls?: string | string[]
	fileNames?: string | string[]
	list?: UploadFileData[]
	url?: string
	fileName?: string
}

const splitUploadValues = (value: string | string[] | undefined | null) => {
	if (!value) return []
	if (Array.isArray(value)) return value.map(item => String(item).trim()).filter(Boolean)
	return String(value)
		.split(',')
		.map(item => item.trim())
		.filter(Boolean)
}

const pickUploadUrl = (item: unknown): string => {
	if (typeof item === 'string') return item.trim()
	if (!item || typeof item !== 'object') return ''
	const data = item as UploadFileData & { fileUrl?: string }
	return String(data.url || data.fileUrl || data.fileName || '').trim()
}

const extractUploadUrls = (payload: unknown) => {
	if (typeof payload === 'string') {
		return splitUploadValues(payload)
	}

	if (Array.isArray(payload)) {
		return payload.map(pickUploadUrl).filter(Boolean)
	}

	if (payload && typeof payload === 'object') {
		const data = payload as BatchUploadFileData
		if (data.urls !== undefined) return splitUploadValues(data.urls)
		if (Array.isArray(data.list)) return data.list.map(pickUploadUrl).filter(Boolean)
		if (data.fileNames !== undefined) return splitUploadValues(data.fileNames)
		const single = pickUploadUrl(data)
		if (single) return [single]
	}

	return []
}

export const uploadAiImageFileController = async (file: File) => {
	const request = useRequest()
	const body = new FormData()
	body.append('file', file)

	const response = await request<ApiResponse<UploadFileData | string>>('/object/upload', {
		method: 'POST',
		query: { directory: 'user-upload' },
		body,
	})

	const url = extractUploadUrls(response.data)[0]
	if (!url) {
		throw new Error('Upload succeeded but no file URL was returned')
	}
	return url
}

export const uploadAiImageFilesController = async (files: File[]) => {
	const request = useRequest()
	const body = new FormData()
	files.forEach(file => body.append('files', file))

	const response = await request<ApiResponse<BatchUploadFileData | UploadFileData[] | string>>(
		'/object/uploads',
		{
			method: 'POST',
			query: { directory: 'user-upload' },
			body,
		},
	)

	const urls = extractUploadUrls(response.data)
	if (!urls.length) {
		throw new Error('Upload succeeded but no file URLs were returned')
	}
	return urls
}

export interface AiResultMedia {
	mediaId?: number | string
	mediaType?: string
	url?: string
	fileName?: string
	mimeType?: string
	size?: number
	width?: number
	height?: number
	ratio?: string
	resolution?: string
	createTime?: number | string
}

export interface AiImageResultItem {
	imageId?: number | string
	traceId?: string
	status?: string
	prompt?: string
	userImages?: string[] | string
	width?: number
	height?: number
	platformCode?: number
	modelCode?: number
	ratio?: string
	resolution?: string
	quality?: 'low' | 'medium' | 'high'
	n?: number
	creditCost?: number
	media?: AiResultMedia
	errorInfo?: string
	createTime?: number | string
	updateTime?: number | string
}

export interface HistoryResponse {
	total?: number
	rows?: AiImageResultItem[]
	code?: number | string
	msg?: string
}

export interface ImageHistoryQuery {
	pageNum?: number
	pageSize?: number
	startTime?: number
	endTime?: number
	prompt?: string
}

export const generateAiImageController = (data: GenerateAiImagePayload) => {
	const request = useRequest()

	return request<ApiResponse<GenerateImageData>>('/ai/image/generate', {
		method: 'POST',
		body: data,
	})
}

export const deleteAiImageController = (imageId: number | string) => {
	const request = useRequest()

	return request<ApiResponse<null>>(`/ai/image/${encodeURIComponent(String(imageId))}`, {
		method: 'DELETE',
	})
}

export const getAiImageResultController = (traceId: string) => {
	const request = useRequest()

	return request<ApiResponse<AiImageResultItem[]>>('/ai/image/result', {
		method: 'GET',
		query: { traceId },
	})
}

export const getAiImageHistoryController = (query: ImageHistoryQuery) => {
	const request = useRequest()

	return request<HistoryResponse>('/ai/image/history', {
		method: 'GET',
		query,
	})
}
