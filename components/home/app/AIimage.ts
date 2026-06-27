export type HistoryRecord = {
	id: string
	model: string
	type: string
	time: string
	status: 'failed' | 'processing' | 'success'
	prompt: string
	image: string
	traceId?: string
	progress?: number
	errorInfo?: string
}

export type ImageModelId = 'gpt-image-2' | 'nano-banana-pro' | 'nano-banana-2' | 'nano-banana' | 'seedream-4-5'
export type ImageModel = {
	id: ImageModelId
	name: string
	desc: string
	credits: string
	icon: 'openai' | 'google' | 'seedream'
	platformCode: number
	textModelCode: number
	imageModelCode: number
}
export type QualityValue = 'low' | 'medium' | 'high'
export type ResolutionValue = '1K' | '2K' | '4K'
export type CreationTabId = 'my-creations' | 'templates' | 'tutorials'
export type AspectRatioValue = 'auto' | '1:1' | '1:2' | '2:1' | '2:3' | '3:2' | '4:3' | '3:4' | '4:5' | '5:4' | '16:9' | '9:16' | '21:9'
export type ApiResponse<T> = {
	code: number | string
	msg?: string
	data: T
}
export type UploadFileData = {
	url: string
	fileName?: string
	newFileName?: string
	directory?: string
	originalFilename?: string
	size?: number
}
export type GenerateImageData = {
	traceId: string
	status?: string
	creditCost?: number
	remainingBalance?: number
}
export type AiResultMedia = {
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
export type AiImageResultItem = {
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
export type HistoryResponse = {
	total?: number
	rows?: AiImageResultItem[]
	code?: number | string
	msg?: string
}
export type AiImageGeneratorCopy = {
	composerLabel: string
	creationModeLabel: string
	aiImage: string
	aiVideo: string
	modelSearchPlaceholder: string
	imageUpload: string
	imageUploadHelp: string
	uploadedImageAlt: string
	removeImage: string
	add: string
	uploadImages: string
	uploadHint: string
	imagesSelected: string
	promptPlaceholder: string
	aiPrompt: string
	aspectRatio: string
	autoRatio: string
	quality: string
	resolution: string
	numberOfImages: string
	private: string
	creditsRequired: string
	creditsHelp: string
	credits: string
	creditsShort: string
	uploading: string
	generating: string
	create: string
	myCreations: string
	templates: string
	tutorials: string
	creationViews: string
	allTime: string
	allTypes: string
	searchPlaceholder: string
	selectCreations: string
	openAsset: string
	generatingImage: string
	traceId: string
	preparingTask: string
	failed: string
	failedMessage: string
	refundedMessage: string
	retry: string
	delete: string
	emptyStateTitle: string
	emptyStateDescription: string
	stillPending: string
	generationFailed: string
	recordTypeImage: string
	fallbackModelName: string
	now: string
	qualities: Record<QualityValue, { label: string; desc: string }>
	models: Record<ImageModelId, { desc: string; credits: string }>
}
