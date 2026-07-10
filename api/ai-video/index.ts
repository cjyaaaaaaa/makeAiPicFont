export interface ApiResponse<T> {
	code: number | string
	msg?: string
	data: T
}

export interface GenerateVideoData {
	traceId: string
	status?: string
	creditCost?: number
	remainingBalance?: number
}

export interface GenerateAiVideoPayload {
	platformCode: number
	modelCode: number
	prompt: string
	images?: string[]
	ratio: string
	resolution: string
	n?: number
	duration: number
	generateAudio: boolean
}

export interface AiVideoMedia {
	duration_ms?: number
	url?: string
	mimeType?: string
	size?: number
	width?: number
	height?: number
	ratio?: string
	resolution?: string
}

export interface AiVideoResultItem {
	videoId?: number
	taskId?: string
	traceId?: string
	status?: string
	prompt?: string
	userImages?: string[] | string
	platformCode?: number
	modelCode?: number
	ratio?: string
	resolution?: string
	duration?: number
	generateAudio?: boolean
	creditCost?: number
	media?: AiVideoMedia
	errorInfo?: string
	createTime?: number | string
}

export interface VideoHistoryResponse {
	total?: number
	rows?: AiVideoResultItem[]
	code?: number | string
	msg?: string
}

export interface VideoHistoryQuery {
	pageNum?: number
	pageSize?: number
	startTime?: number
	endTime?: number
	prompt?: string
}

export const generateAiVideoController = (data: GenerateAiVideoPayload) => {
	const request = useRequest()

	return request<ApiResponse<GenerateVideoData>>('/ai/video/generate', {
		method: 'POST',
		body: data,
	})
}

export const getAiVideoResultController = (traceId: string) => {
	const request = useRequest()

	return request<ApiResponse<AiVideoResultItem[]>>('/ai/video/result', {
		method: 'GET',
		query: { traceId },
	})
}

export const getAiVideoHistoryController = (query: VideoHistoryQuery) => {
	const request = useRequest()

	return request<VideoHistoryResponse>('/ai/video/history', {
		method: 'GET',
		query,
	})
}
