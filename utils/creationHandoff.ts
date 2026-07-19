export const CREATION_HANDOFF_STORAGE_KEY = 'gptpix.creationHandoff'

type CreationHandoffMedia = 'image' | 'video'

type CreationHandoffBase = {
	version: 1
	media: CreationHandoffMedia
	intent?: 'generation' | 'template'
	traceId: string
	prompt: string
	modelName: string
	createdAt: number
}

export type ImageCreationHandoff = CreationHandoffBase & {
	media: 'image'
	params: {
		modelId?: string
		platformCode: number
		modelCode: number
		prompt: string
		ratio?: string
		resolution?: string
		quality?: 'low' | 'medium' | 'high'
		imageCount?: number
		userImages?: string[]
	}
}

export type VideoCreationHandoff = CreationHandoffBase & {
	media: 'video'
	params: {
		platformCode: number
		modelCode: number
		prompt: string
		ratio?: string
		resolution?: string
		duration?: number
		generateAudio?: boolean
		userImages?: string[]
	}
}

export type CreationHandoff = ImageCreationHandoff | VideoCreationHandoff

const HANDOFF_TTL_MS = 30 * 60 * 1000

const canUseSessionStorage = () => import.meta.client && typeof window !== 'undefined' && Boolean(window.sessionStorage)

export const writeCreationHandoff = (handoff: CreationHandoff) => {
	if (!canUseSessionStorage()) return
	window.sessionStorage.setItem(CREATION_HANDOFF_STORAGE_KEY, JSON.stringify(handoff))
}

export const consumeCreationHandoff = (media: CreationHandoffMedia) => {
	if (!canUseSessionStorage()) return null
	const raw = window.sessionStorage.getItem(CREATION_HANDOFF_STORAGE_KEY)
	if (!raw) return null

	try {
		const handoff = JSON.parse(raw) as CreationHandoff
		if (handoff.media !== media) return null
		window.sessionStorage.removeItem(CREATION_HANDOFF_STORAGE_KEY)
		if (!handoff.traceId || Date.now() - handoff.createdAt > HANDOFF_TTL_MS) return null
		return handoff
	} catch {
		window.sessionStorage.removeItem(CREATION_HANDOFF_STORAGE_KEY)
		return null
	}
}
