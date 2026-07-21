export type VideoHistoryRecord = {
	id: string
	model: string
	type: string
	time: string
	status: 'failed' | 'processing' | 'success'
	prompt: string
	video: string
	traceId?: string
	progress?: number
	errorInfo?: string
	duration?: number
	params?: VideoGenerationParams
}

export type VideoGenerationParams = {
	platformCode?: number
	modelCode?: number
	prompt: string
	ratio?: string
	resolution?: string
	duration?: number
	generateAudio?: boolean
	userImages?: string[]
}

export type VideoModelId = 'seedance-2-0'
export type VideoResolutionValue = '480p' | '720p' | '1080p' | '4k'
export type VideoAspectRatioValue = '21:9' | '16:9' | '9:16' | '4:3' | '3:4' | '1:1'
export type CreationTabId = 'my-creations' | 'templates' | 'tutorials'

export type VideoModel = {
	id: VideoModelId
	name: string
	desc: string
	credits: string
	icon: 'seedance'
	textToVideo: {
		platformCode: number
		modelCode: number
	}
	imageToVideo: {
		platformCode: number
		modelCode: number
	}
}

export type AiVideoGeneratorCopy = {
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
	resolution: string
	duration: string
	durationUnit: string
	generateAudio: string
	generateAudioHelp: string
	creditsRequired: string
	creditsHelp: string
	credits: string
	creditsPerSecond: string
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
	generatingVideo: string
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
	recordTypeVideo: string
	fallbackModelName: string
	now: string
	models: Record<VideoModelId, { desc: string; credits: string }>
}

export const SEEDANCE_RATIOS: VideoAspectRatioValue[] = ['21:9', '16:9', '9:16', '4:3', '3:4', '1:1']
export const SEEDANCE_RESOLUTIONS: VideoResolutionValue[] = ['480p', '720p', '1080p', '4k']
export const VIDEO_CREDITS_PER_SECOND: Record<VideoResolutionValue, number> = {
	'480p': 19,
	'720p': 31,
	'1080p': 50,
	'4k': 100,
}
export const SEEDANCE_CREDITS_PER_SECOND = VIDEO_CREDITS_PER_SECOND['480p']
export const SEEDANCE_DURATION_MIN = 4
export const SEEDANCE_DURATION_MAX = 15
export const SEEDANCE_DURATION_OPTIONS = [4, 5, 6, 8, 10, 12, 15] as const

export const getVideoCredits = (
	duration: number,
	resolution: VideoResolutionValue = '480p',
) => VIDEO_CREDITS_PER_SECOND[resolution] * duration
