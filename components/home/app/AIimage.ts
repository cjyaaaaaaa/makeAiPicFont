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
	params?: ImageGenerationParams
}

export type ImageGenerationParams = {
	modelId?: ImageModelId
	platformCode?: number
	modelCode?: number
	prompt: string
	ratio?: string
	resolution?: string
	quality?: QualityValue
	imageCount?: number
	userImages?: string[]
}

export type ImageModelId = 'gpt-image-2' | 'nano-banana-pro' | 'nano-banana-2' | 'nano-banana' | 'seedream-4-5'
export type ModelProfile = 'seedream' | 'gpt-image'
export type ImageModel = {
	id: ImageModelId
	name: string
	desc: string
	credits: string
	icon: 'openai' | 'google' | 'seedream'
	profile: ModelProfile
	textToImage: {
		platformCode: number
		modelCode: number
	}
	imageToImage: {
		platformCode: number
		modelCode: number
	}
}
export type QualityValue = 'low' | 'medium' | 'high'
export type ResolutionValue = '1K' | '2K' | '4K'
export type CreationTabId = 'my-creations' | 'templates' | 'tutorials'
export type AspectRatioValue = 'auto' | '1:1' | '1:2' | '2:1' | '2:3' | '3:2' | '4:3' | '3:4' | '4:5' | '5:4' | '16:9' | '9:16' | '9:21' | '21:9'
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
	mediaId?: number | string
	mediaType?: string
	url?: string
	fileName?: string
	mimeType?: string
	size?: number
	width?: number
	height?: number
	createTime?: number | string
}
export type AiImageResultItem = {
	imageId?: number | string
	traceId?: string
	status?: string
	prompt?: string
	userImages?: string[]
	width?: number
	height?: number
	platformCode?: number
	modelCode?: number
	creditCost?: number
	media?: AiResultMedia
	errorInfo?: string
	createTime?: number | string
	updateTime?: number | string
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
	templateCategoriesLabel: string
	tutorialsTitle: string
	tutorialsDesc: string
	tutorialsVideoLabel: string
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

export const SEEDREAM_RATIOS: AspectRatioValue[] = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '9:21', '21:9']
export const SEEDREAM_RESOLUTIONS: ResolutionValue[] = ['1K', '2K', '4K']
export const GPT_IMAGE_RATIOS: AspectRatioValue[] = ['1:1', '2:3', '3:2', '3:4', '4:3', '9:16', '16:9', '21:9']
export const GPT_IMAGE_RESOLUTIONS: ResolutionValue[] = ['1K', '2K', '4K']

export const GPT_IMAGE_TEXT_CREDITS: Record<QualityValue, Record<ResolutionValue, number>> = {
	low: { '1K': 5, '2K': 5, '4K': 5 },
	medium: { '1K': 5, '2K': 5, '4K': 5 },
	high: { '1K': 5, '2K': 5, '4K': 5 },
}

export const GPT_IMAGE_EDIT_CREDITS: Record<QualityValue, Record<ResolutionValue, number>> = {
	low: { '1K': 5, '2K': 5, '4K': 5 },
	medium: { '1K': 5, '2K': 5, '4K': 5 },
	high: { '1K': 5, '2K': 5, '4K': 5 },
}

export const SEEDREAM_CREDITS_PER_TASK = 10

export const MODEL_PROFILES: Record<ModelProfile, {
	supportedRatios: AspectRatioValue[]
	supportedResolutions: ResolutionValue[]
	supportsQuality: boolean
	supportsAutoRatio: boolean
}> = {
	seedream: {
		supportedRatios: SEEDREAM_RATIOS,
		supportedResolutions: SEEDREAM_RESOLUTIONS,
		supportsQuality: false,
		supportsAutoRatio: false,
	},
	'gpt-image': {
		supportedRatios: GPT_IMAGE_RATIOS,
		supportedResolutions: GPT_IMAGE_RESOLUTIONS,
		supportsQuality: true,
		supportsAutoRatio: true,
	},
}

export const getGptImageCredits = (
	quality: QualityValue,
	resolution: ResolutionValue,
	hasImages: boolean,
) => {
	const matrix = hasImages ? GPT_IMAGE_EDIT_CREDITS : GPT_IMAGE_TEXT_CREDITS
	return matrix[quality][resolution]
}

export const getModelCredits = (
	modelId: ImageModelId,
	quality: QualityValue,
	resolution: ResolutionValue,
	hasImages: boolean,
	imageCount: number,
) => {
	if (modelId === 'gpt-image-2') return getGptImageCredits(quality, resolution, hasImages) * imageCount
	if (modelId === 'nano-banana-2' || modelId === 'nano-banana-pro') {
		return ({ '1K': 10, '2K': 15, '4K': 20 } satisfies Record<ResolutionValue, number>)[resolution] * imageCount
	}
	return SEEDREAM_CREDITS_PER_TASK * imageCount
}
