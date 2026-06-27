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
}

export interface UploadFileData {
	url: string
	fileName?: string
	newFileName?: string
	directory?: string
	originalFilename?: string
	size?: number
}

export interface AiResultMedia {
	mediaId?: number
	mediaType?: string
	url?: string
	fileName?: string
	mimeType?: string
	size?: number
	width?: number
	height?: number
	createTime?: string
}

export interface AiImageResultItem {
	imageId?: number
	traceId?: string
	status?: string
	prompt?: string
	userImages?: string
	width?: number
	height?: number
	platformCode?: number
	modelCode?: number
	creditCost?: number
	media?: AiResultMedia
	errorInfo?: string
	createTime?: string
	updateTime?: string
}

export interface HistoryResponse {
	total?: number
	rows?: AiImageResultItem[]
	code?: number | string
	msg?: string
}

export interface ImageHistoryQuery {
	startTime: string
	endTime: string
}

const extractUploadUrls = (payload: unknown) => {
	if (Array.isArray(payload)) {
		return payload.map(item => (item as UploadFileData).url).filter(Boolean)
	}
	if (payload && typeof payload === 'object') {
		const data = payload as UploadFileData & { urls?: string[]; list?: UploadFileData[] }
		if (Array.isArray(data.urls)) return data.urls.filter(Boolean)
		if (Array.isArray(data.list)) return data.list.map(item => item.url).filter(Boolean)
		if (data.url) return [data.url]
	}
	return []
}

export const uploadAiImageFileController = async (file: File) => {
	const request = useRequest()
	const body = new FormData()
	body.append('file', file)

	const response = await request<ApiResponse<UploadFileData>>('/oss/uploadToDir', {
		method: 'POST',
		query: { directory: 'user-upload' },
		body,
	})

	return response.data.url
}

export const uploadAiImageFilesController = async (files: File[]) => {
	const request = useRequest()
	const body = new FormData()
	files.forEach(file => body.append('files', file))

	const response = await request<ApiResponse<UploadFileData[] | { urls?: string[]; list?: UploadFileData[] }>>(
		'/oss/uploadsToDir',
		{
			method: 'POST',
			query: { directory: 'user-upload' },
			body,
		},
	)

	return extractUploadUrls(response.data)
}

export const generateAiImageController = (data: GenerateAiImagePayload) => {
	const request = useRequest()

	return request<ApiResponse<GenerateImageData>>('/ai/image/generate', {
		method: 'POST',
		body: data,
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
