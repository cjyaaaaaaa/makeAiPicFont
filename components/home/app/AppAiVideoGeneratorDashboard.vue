<template>
	<div
		:class="[
			'grid min-h-screen bg-[#050505] text-[#f5f5f5] transition-[grid-template-columns] duration-200',
			sidebarCollapsed ? 'grid-cols-[84px_minmax(0,1fr)]' : 'grid-cols-[288px_minmax(0,1fr)]',
		]"
	>
		<AppHomeSidebar :collapsed="sidebarCollapsed" @toggle-collapse="sidebarCollapsed = !sidebarCollapsed" />

		<main class="grid h-dvh min-w-0 grid-cols-[clamp(390px,34vw,560px)_minmax(0,1fr)] overflow-hidden max-xl:grid-cols-[clamp(360px,40vw,500px)_minmax(0,1fr)] max-[1120px]:h-auto max-[1120px]:grid-cols-1 max-[1120px]:overflow-visible">
			<section ref="composerRef" class="flex min-w-0 flex-col gap-3.5 overflow-y-auto border-r border-white/10 bg-[#101012] px-[22px] pt-4 max-[1120px]:h-auto max-[1120px]:border-b max-[1120px]:border-r-0" :aria-label="copy.composerLabel">
				<AppCreationModeSwitcher
					active-mode="video"
					:creation-mode-label="copy.creationModeLabel"
					:ai-image-label="copy.aiImage"
					:ai-video-label="copy.aiVideo"
				/>

				<div ref="modelPickerRef" class="relative z-[8]">
					<button type="button" class="grid min-h-[58px] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[10px] border border-white/10 bg-[#131315] px-3 text-left text-white/50" :aria-expanded="modelPickerOpen" @click="modelPickerOpen = !modelPickerOpen">
						<AppModelBrandIcon name="seedance" />
						<span class="min-w-0">
							<strong class="block truncate text-[13px] font-[850] text-white/90">{{ selectedModel.name }}</strong>
							<small class="mt-[3px] block truncate text-[11px] font-semibold text-white/35">{{ selectedModel.desc }}</small>
						</span>
						<svg class="h-4 w-4 transition-transform duration-150" :class="{ 'rotate-180': modelPickerOpen }" viewBox="0 0 20 20" fill="none" aria-hidden="true">
							<path d="M5.5 8L10 12.5L14.5 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>

					<div v-if="modelPickerOpen" class="absolute left-0 right-0 top-[calc(100%+8px)] z-10 overflow-hidden rounded-xl border border-white/15 bg-[#151517] shadow-[0_22px_60px_rgba(0,0,0,0.56)]">
						<div class="grid gap-1 p-2">
							<button
								v-for="model in localizedVideoModels"
								:key="model.id"
								type="button"
								:class="[
									'grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-white/60 hover:bg-white/10',
									model.id === selectedModelId ? 'bg-white/10' : 'bg-transparent',
								]"
								@click="selectModel(model.id)"
							>
								<AppModelBrandIcon name="seedance" />
								<span class="min-w-0">
									<strong class="block truncate text-[13px] font-[850] text-white/90">{{ model.name }}</strong>
									<small class="mt-[3px] block truncate text-[11px] font-semibold text-white/40">{{ model.desc }}</small>
									<em class="mt-2 block w-fit rounded-md border border-white/10 bg-white/5 px-2 py-0.5 text-[10.5px] not-italic text-white/40">{{ model.credits }}</em>
								</span>
							</button>
						</div>
					</div>
				</div>

				<div class="flex items-center justify-between gap-4">
					<h2 class="m-0 text-[13px] font-[850] text-white/80">{{ copy.imageUpload }}</h2>
					<button type="button" class="grid h-[18px] w-[18px] place-items-center rounded-full border border-white/25 text-[11px] font-[850] text-white/45" :aria-label="copy.imageUploadHelp">?</button>
				</div>

				<div v-if="uploadedCount" class="min-h-[98px] shrink-0 overflow-hidden rounded-[14px] border border-white/10 bg-[#171719] px-3 py-3">
					<div class="flex min-h-[74px] max-w-full items-center gap-3 overflow-x-auto overflow-y-hidden pb-1 [scrollbar-width:thin]">
						<div v-for="(preview, index) in uploadedPreviews" :key="preview" class="relative h-[74px] min-h-[74px] w-[74px] min-w-[74px] shrink-0 overflow-hidden rounded-[12px] border border-white/15 bg-[#101012]">
							<img class="h-full w-full object-cover" :src="preview" :alt="t('aiVideoGenerator.uploadedImageAlt', { index: index + 1 })" />
							<button type="button" class="absolute right-1 top-1 grid h-[18px] w-[18px] place-items-center rounded-full bg-black/55 text-base leading-none text-white/90 hover:bg-white hover:text-[#111]" :aria-label="t('aiVideoGenerator.removeImage', { index: index + 1 })" @click="removeUploadedImage(index)">x</button>
							<span class="absolute bottom-1.5 left-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-black/50 text-[11px] font-[850] leading-none text-white/80">{{ index + 1 }}</span>
						</div>
						<label v-if="uploadedCount < 8" class="relative grid h-[74px] min-h-[74px] w-[74px] min-w-[74px] shrink-0 cursor-pointer place-items-center content-center gap-1.5 overflow-hidden rounded-[12px] border border-dashed border-white/20 bg-[#101012] text-white/35 hover:border-white/35 hover:bg-[#1f1f21] hover:text-white/60">
							<input class="sr-only" type="file" multiple accept="image/png,image/jpeg,image/webp" @change="handleFiles" />
							<span class="text-2xl font-light leading-none" aria-hidden="true">+</span>
							<strong class="text-xs font-bold">{{ copy.add }}</strong>
						</label>
					</div>
				</div>

				<label v-if="!uploadedCount" class="grid min-h-[clamp(132px,17vh,168px)] cursor-pointer place-items-center gap-2 rounded-[13px] border-2 border-dashed border-white/25 bg-[#202022] p-4 text-center text-white/35">
					<input class="sr-only" type="file" multiple accept="image/png,image/jpeg,image/webp" @change="handleFiles" />
					<svg class="h-[34px] w-[34px]" viewBox="0 0 28 28" fill="none" aria-hidden="true">
						<path d="M14 19V5.5M9.2 10.4L14 5.5L18.8 10.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M6.5 17.5V20.8A2.2 2.2 0 0 0 8.7 23H19.3A2.2 2.2 0 0 0 21.5 20.8V17.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
					</svg>
					<strong class="text-[13px] font-[850] text-white/50">{{ uploadedCount ? t('aiVideoGenerator.imagesSelected', { count: uploadedCount }) : copy.uploadImages }}</strong>
					<span class="text-[11.5px] font-semibold">{{ copy.uploadHint }}</span>
				</label>

				<div class="grid min-h-[clamp(238px,32vh,310px)] grid-rows-[minmax(190px,1fr)_auto] overflow-hidden rounded-xl border border-white/10 bg-[#171719]">
					<textarea id="ai-video-prompt" v-model="prompt" class="min-h-0 w-full resize-none bg-transparent p-4 text-[12.5px] font-semibold leading-normal text-white/80 outline-none placeholder:text-white/30" maxlength="20000" :placeholder="copy.promptPlaceholder" />
					<div class="flex items-center justify-between gap-4 px-3.5 pb-3 text-[11px] font-bold text-white/25">
						<span class="inline-flex items-center gap-1.5">
							<svg class="h-[13px] w-[13px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
								<path d="M5 15L15 5M6.5 5.5L7.5 7.5L9.5 8.5L7.5 9.5L6.5 11.5L5.5 9.5L3.5 8.5L5.5 7.5L6.5 5.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
							</svg>
							{{ copy.aiPrompt }}
						</span>
						<small>{{ prompt.length.toLocaleString() }} / 20,000</small>
					</div>
				</div>

				<div class="grid gap-4 py-1" @pointerdown="modelPickerOpen = false">
					<section class="grid gap-2.5">
						<h3 class="m-0 text-[13px] font-[850] text-white/90">{{ copy.aspectRatio }}</h3>
						<div class="grid grid-cols-3 gap-2">
							<button v-for="ratio in aspectRatios" :key="ratio" type="button" :class="choiceButtonClass(selectedAspectRatio === ratio)" @click="selectedAspectRatio = ratio">
								{{ ratio }}
							</button>
						</div>
					</section>

					<section class="grid gap-2.5">
						<h3 class="m-0 text-[13px] font-[850] text-white/90">{{ copy.resolution }}</h3>
						<div class="grid grid-cols-4 gap-2">
							<button v-for="resolution in resolutionOptions" :key="resolution.value" type="button" :class="choiceButtonClass(selectedResolution === resolution.value, 'min-h-[52px]')" @click="selectedResolution = resolution.value">
								<strong class="block leading-tight uppercase">{{ resolution.label }}</strong>
								<span class="mt-1 block text-[11px] font-bold leading-tight opacity-80">{{ t('aiVideoGenerator.creditsPerSecond', { count: resolution.creditsPerSecond }) }}</span>
							</button>
						</div>
					</section>

					<section class="grid gap-2.5">
						<h3 class="m-0 text-[13px] font-[850] text-white/90">{{ copy.duration }}</h3>
						<div class="grid grid-cols-4 gap-2">
							<button v-for="duration in durationOptions" :key="duration" type="button" :class="choiceButtonClass(selectedDuration === duration)" @click="selectedDuration = duration">
								{{ duration }}{{ copy.durationUnit }}
							</button>
						</div>
					</section>

					<section class="flex items-center justify-between gap-4 rounded-[10px] border border-white/10 bg-[#171719] px-3.5 py-3">
						<div>
							<h3 class="m-0 text-[13px] font-[850] text-white/90">{{ copy.generateAudio }}</h3>
							<p class="m-0 mt-1 text-[11px] font-semibold text-white/35">{{ copy.generateAudioHelp }}</p>
						</div>
						<button
							type="button"
							:class="[
								'relative h-6 w-11 rounded-full transition-colors',
								generateAudio ? 'bg-white' : 'bg-white/20',
							]"
							:aria-label="copy.generateAudio"
							:aria-pressed="generateAudio"
							@click="generateAudio = !generateAudio"
						>
							<span
								:class="[
									'absolute top-0.5 h-5 w-5 rounded-full transition-all',
									generateAudio ? 'left-[22px] bg-[#151515]' : 'left-0.5 bg-white/80',
								]"
							/>
						</button>
					</section>
				</div>

				<div class="sticky bottom-0 mt-auto grid gap-3 border-t border-white/10 bg-[#101012] px-[22px] py-4 -mx-[22px]">
					<div class="flex items-center gap-2 text-xs font-bold text-white/40">
						<span class="grid h-[18px] w-[18px] place-items-center text-[#ffd60a]" aria-hidden="true">
							<svg class="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="none">
								<circle cx="7" cy="7" r="3" stroke="currentColor" stroke-width="1.5" />
								<circle cx="12.5" cy="12.5" r="3" stroke="currentColor" stroke-width="1.5" />
								<path d="M9.2 9.2L10.3 10.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</span>
						<strong>{{ copy.creditsRequired }}</strong>
						<button type="button" class="grid h-4 w-4 place-items-center rounded-full border border-white/20 text-[10px] text-white/40" :aria-label="copy.creditsHelp">i</button>
						<em class="ml-auto not-italic text-white/70">{{ t('aiVideoGenerator.credits', { count: requiredCredits }) }}</em>
					</div>
					<button type="button" class="inline-flex h-[46px] items-center justify-center gap-2.5 rounded-xl bg-white text-[13.5px] font-black text-[#151515] disabled:cursor-not-allowed disabled:opacity-60" :disabled="isUploading || isGenerating" @click="generateVideo">
						<svg class="h-[18px] w-[18px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
							<path d="M10.5 3.5L11.8 7.8L16 9L11.8 10.2L10.5 14.5L9.2 10.2L5 9L9.2 7.8L10.5 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
							<path d="M4.5 13.5L5.2 15.2L7 16L5.2 16.8L4.5 18.5L3.8 16.8L2 16L3.8 15.2L4.5 13.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
						</svg>
						{{ isUploading ? copy.uploading : isGenerating ? copy.generating : copy.create }}
					</button>
				</div>
			</section>

			<section class="h-dvh min-w-0 overflow-y-auto bg-[#050505] px-6 py-8 max-[1120px]:h-auto max-[1120px]:pt-6" :aria-label="copy.myCreations">
				<div class="mb-3.5 flex items-center gap-2.5" role="tablist" :aria-label="copy.creationViews">
					<button v-for="tab in tabs" :key="tab.id" type="button" :class="['min-h-[34px] rounded-full px-3.5 text-[12.5px] font-[850]', activeTab === tab.id ? 'bg-white text-[#151515]' : 'bg-transparent text-white/35']" @click="activeTab = tab.id">
						{{ tab.label }}
					</button>
				</div>

				<AppCreationToolbar
					v-if="activeTab === 'my-creations' && !showAuthRequired"
					v-model:search="searchQuery"
					v-model:selected-time="timeFilter"
					v-model:selected-type="typeFilter"
					v-model:start-date="startDate"
					v-model:end-date="endDate"
					:time-label="selectedTimeLabel"
					:type-label="selectedTypeLabel"
					:time-options="toolbarCopy.timeFilters"
					:type-options="toolbarCopy.typeFilters"
					:start-date-label="toolbarCopy.startDate"
					:end-date-label="toolbarCopy.endDate"
					:clear-date-label="toolbarCopy.clearDate || 'Clear'"
					:previous-month-label="toolbarCopy.previousMonth || 'Previous month'"
					:next-month-label="toolbarCopy.nextMonth || 'Next month'"
					date-clearable
					:search-label="copy.searchPlaceholder"
					:search-placeholder="copy.searchPlaceholder"
					:select-label="copy.selectCreations"
				/>

				<AppCreationTemplatesPanel
					v-if="activeTab === 'templates'"
					:categories-label="copy.templateCategoriesLabel"
					@select="applyTemplate"
				/>

				<AppCreationTutorialsPanel
					v-else-if="activeTab === 'tutorials'"
					:title="copy.tutorialsTitle"
					:description="copy.tutorialsDesc"
					:video-src="AI_VIDEO_TUTORIAL_VIDEO"
					:video-label="copy.tutorialsVideoLabel"
				/>

				<template v-else-if="activeTab === 'my-creations'">
				<AppAuthRequiredState
					v-if="showAuthRequired"
					:title="t('auth.loginRequiredTitle')"
					:message="t('auth.loginRequiredMessage')"
					:action-label="t('auth.loginRequiredAction')"
					@login="loginOpen = true"
				/>
				<div v-else-if="visibleRecords.length" class="grid gap-3 xl:grid-cols-2 2xl:grid-cols-3">
					<AppCreationRecordCard
						v-for="record in visibleRecords"
						:key="record.id"
						:model="record.model"
						:type-label="record.type"
						:time="record.duration ? `${record.time} · ${record.duration}s` : record.time"
						:prompt="record.prompt"
						:status="record.status"
						:media-src="record.video"
						media-type="video"
						:progress="record.progress"
						:processing-label="copy.generatingVideo"
						:progress-label="record.progress !== undefined ? `${record.progress}%` : copy.preparingTask"
						:trace-label="record.traceId ? t('aiVideoGenerator.traceId', { traceId: record.traceId }) : copy.preparingTask"
						:failed-title="copy.failed"
						:failed-message="copy.failedMessage"
						:error-info="record.errorInfo"
						:refunded-message="copy.refundedMessage"
						:retry-label="copy.retry"
						:delete-label="copy.delete"
						:open-label="copy.openAsset"
						:show-delete="false"
						@retry="applyVideoRetry(record)"
					/>
				</div>
				<div v-else class="grid min-h-[360px] place-items-center rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
					<div class="grid max-w-[360px] justify-items-center gap-3">
						<div class="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-[#111113] text-white/45" aria-hidden="true">
							<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none">
								<rect x="3" y="6.5" width="11" height="8" rx="1.6" stroke="currentColor" stroke-width="1.6" />
								<path d="M14.5 8.5L19 6.5V14.5L14.5 12.5V8.5Z" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" />
							</svg>
						</div>
						<strong class="text-sm font-[850] text-white/80">{{ copy.emptyStateTitle }}</strong>
						<p class="m-0 text-xs font-semibold leading-relaxed text-white/40">{{ copy.emptyStateDescription }}</p>
					</div>
				</div>
				</template>
			</section>
		</main>
		<LoginModal :open="loginOpen" @close="loginOpen = false" />
	</div>
</template>

<script setup lang="ts">
import {
	generateAiVideoController,
	getAiVideoHistoryController,
	getAiVideoResultController,
	type GenerateAiVideoPayload,
	type AiVideoResultItem,
} from '~/api/ai-video'
import { uploadAiImageFileController, uploadAiImageFilesController } from '~/api/ai-image'
import AppCreationModeSwitcher from '~/components/home/app/AppCreationModeSwitcher.vue'
import AppCreationTemplatesPanel from '~/components/home/app/AppCreationTemplatesPanel.vue'
import AppCreationTutorialsPanel from '~/components/home/app/AppCreationTutorialsPanel.vue'
import AppCreationToolbar from '~/components/home/app/AppCreationToolbar.vue'
import AppAuthRequiredState from '~/components/home/app/AppAuthRequiredState.vue'
import AppCreationRecordCard from '~/components/home/app/AppCreationRecordCard.vue'
import AppHomeSidebar from '~/components/home/app/AppHomeSidebar.vue'
import AppModelBrandIcon from '~/components/home/app/AppModelBrandIcon.vue'
import LoginModal from '~/components/auth/LoginModal.vue'
import type { TemplateCard, TemplateTabId } from '~/utils/promptTemplates'
import { AI_VIDEO_TUTORIAL_VIDEO } from '~/utils/creationTutorials'
import { consumeCreationHandoff, type VideoCreationHandoff } from '~/utils/creationHandoff'
import {
	SEEDANCE_RATIOS,
	SEEDANCE_RESOLUTIONS,
	VIDEO_CREDITS_PER_SECOND,
	SEEDANCE_DURATION_OPTIONS,
	SEEDANCE_DURATION_MIN,
	SEEDANCE_DURATION_MAX,
	getVideoCredits,
	type AiVideoGeneratorCopy,
	type CreationTabId,
	type VideoAspectRatioValue,
	type VideoHistoryRecord,
	type VideoGenerationParams,
	type VideoModel,
	type VideoModelId,
	type VideoResolutionValue,
} from './AIVideo'

type ToolbarOption = {
	label: string
	value: string
}

type ToolbarCopy = {
	startDate: string
	endDate: string
	clearDate?: string
	previousMonth?: string
	nextMonth?: string
	timeFilters: ToolbarOption[]
	typeFilters: ToolbarOption[]
}

const { t, locale } = useAppI18n()
const { token, user } = useUser()
const { showTipToast } = useTipToast()
const sidebarCollapsed = ref(false)
const activeTab = ref<CreationTabId>('my-creations')
const searchQuery = ref('')
const timeFilter = ref('all')
const typeFilter = ref('all')
const modelPickerOpen = ref(false)
const modelPickerRef = ref<HTMLElement | null>(null)
const composerRef = ref<HTMLElement | null>(null)
const isUploading = ref(false)
const isGenerating = ref(false)
const historyAuthRequired = ref(false)
const isLoggedIn = computed(() => Boolean(token.value && user.value))
const showAuthRequired = computed(() => historyAuthRequired.value || !isLoggedIn.value)
const loginOpen = ref(false)
const uploadedCount = ref(0)
const uploadedFiles = ref<File[]>([])
const uploadedPreviews = ref<string[]>([])
const uploadedImageUrls = ref<string[]>([])
const selectedModelId = ref<VideoModelId>('seedance-2-0')
const selectedAspectRatio = ref<VideoAspectRatioValue>('1:1')
const selectedResolution = ref<VideoResolutionValue>('480p')
const selectedDuration = ref(4)
const generateAudio = ref(true)
const prompt = ref('')
const requestLogin = () => {
	historyAuthRequired.value = true
	loginOpen.value = true
}

const padDatePart = (value: number) => String(value).padStart(2, '0')
const formatAssetDate = (date: Date) => `${padDatePart(date.getFullYear() % 100)}-${padDatePart(date.getMonth() + 1)}-${padDatePart(date.getDate())}`
const parseAssetDate = (value: string) => {
	const match = value.match(/^(\d{2})-(\d{2})-(\d{2})$/)
	if (!match) return null
	const year = 2000 + Number(match[1])
	const month = Number(match[2]) - 1
	const day = Number(match[3])
	const date = new Date(year, month, day)
	return Number.isNaN(date.getTime()) ? null : date
}
const parseRecordDate = (value: string, fallbackYear: number) => {
	const match = value.match(/^(\d{2})\/(\d{2})/)
	if (!match) return null
	const month = Number(match[1]) - 1
	const day = Number(match[2])
	const date = new Date(fallbackYear, month, day)
	return Number.isNaN(date.getTime()) ? null : date
}
const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0)
const endOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), 23, 59, 59, 999)
const startOfWeek = (date: Date) => {
	const start = startOfDay(date)
	start.setDate(start.getDate() - start.getDay())
	return start
}
const endDate = ref(formatAssetDate(new Date()))
const startDate = ref('')

const copy = computed(() => t('aiVideoGenerator') as AiVideoGeneratorCopy)
const toolbarCopy = computed(() => t('assets') as ToolbarCopy)
const customTimeLabel = computed(() => locale.value === 'zh' ? '自定义' : 'Custom')
const selectedTimeLabel = computed(() => toolbarCopy.value.timeFilters.find(option => option.value === timeFilter.value)?.label ?? (timeFilter.value === 'custom' ? customTimeLabel.value : copy.value.allTime))
const selectedTypeLabel = computed(() => toolbarCopy.value.typeFilters.find(option => option.value === typeFilter.value)?.label ?? copy.value.allTypes)
const tabs = computed<Array<{ id: CreationTabId; label: string }>>(() => [
	{ id: 'my-creations', label: copy.value.myCreations },
	{ id: 'templates', label: copy.value.templates },
	{ id: 'tutorials', label: copy.value.tutorials },
])

const videoModels: VideoModel[] = [
	{
		id: 'seedance-2-0',
		name: 'Seedance 2.0',
		desc: '',
		credits: '',
		icon: 'seedance',
		textToVideo: { platformCode: 2, modelCode: 10001 },
		imageToVideo: { platformCode: 2, modelCode: 10002 },
	},
]

const choiceButtonClass = (active: boolean, minHeight = 'min-h-[38px]') => [
	'grid min-w-0 place-items-center rounded-[9px] border px-2 text-[13px] font-[850] transition-colors',
	minHeight,
	active
		? 'border-white/20 bg-[#3a3a3d] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
		: 'border-white/10 bg-[#1f1f21] text-white/60 hover:border-white/20 hover:bg-[#252527] hover:text-white/80',
]

const aspectRatios = SEEDANCE_RATIOS
const durationOptions = SEEDANCE_DURATION_OPTIONS
const resolutionOptions = SEEDANCE_RESOLUTIONS.map(value => ({
	label: value,
	value,
	creditsPerSecond: VIDEO_CREDITS_PER_SECOND[value],
}))
const localizedVideoModels = computed(() => videoModels.map(model => ({
	...model,
	desc: copy.value.models[model.id]?.desc ?? model.name,
	credits: copy.value.models[model.id]?.credits ?? '',
})))
const selectedModel = computed(() => localizedVideoModels.value.find(model => model.id === selectedModelId.value) ?? localizedVideoModels.value[0])
const requiredCredits = computed(() => getVideoCredits(selectedDuration.value, selectedResolution.value))

const records = ref<VideoHistoryRecord[]>([])

const visibleRecords = computed(() => {
	const rangeStart = timeFilter.value === 'custom' ? parseAssetDate(startDate.value) : null
	const rangeEnd = timeFilter.value === 'custom' ? parseAssetDate(endDate.value) : null
	const now = new Date()
	const weekStart = new Date(now)
	weekStart.setDate(now.getDate() - 7)
	const fallbackYear = rangeStart?.getFullYear() ?? rangeEnd?.getFullYear() ?? now.getFullYear()

	return records.value.filter((record) => {
		if (typeFilter.value !== 'all' && typeFilter.value !== 'video') return false

		const recordDate = parseRecordDate(record.time, fallbackYear)
		if (!recordDate) return true
		if (timeFilter.value === 'custom') {
			if (rangeStart && recordDate < rangeStart) return false
			if (rangeEnd && recordDate > rangeEnd) return false
		} else if (timeFilter.value === 'today') {
			if (recordDate.toDateString() !== now.toDateString()) return false
		} else if (timeFilter.value === 'week') {
			if (recordDate < weekStart) return false
		}
		return true
	})
})

const sleep = (ms: number) => new Promise(resolve => window.setTimeout(resolve, ms))

const formatRecordTime = (value?: number | string) => {
	if (!value) return copy.value.now
	if (typeof value === 'number') {
		const date = new Date(value)
		return `${padDatePart(date.getMonth() + 1)}/${padDatePart(date.getDate())} ${padDatePart(date.getHours())}:${padDatePart(date.getMinutes())}`
	}
	const match = value.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/)
	return match ? `${match[2]}/${match[3]} ${match[4]}:${match[5]}` : value
}

const parseUserImages = (value?: string[] | string) => {
	if (!value) return []
	if (Array.isArray(value)) return value.filter(Boolean)
	try {
		const parsed = JSON.parse(value)
		return Array.isArray(parsed) ? parsed.filter(Boolean) : [value]
	} catch {
		return value ? [value] : []
	}
}

const normalizeVideoResolution = (value?: string): VideoResolutionValue | undefined => {
	if (!value) return undefined
	const lower = value.toLowerCase()
	if (SEEDANCE_RESOLUTIONS.includes(lower as VideoResolutionValue)) return lower as VideoResolutionValue
	return undefined
}

const normalizeVideoDuration = (value?: number) => {
	if (!value) return undefined
	if (SEEDANCE_DURATION_OPTIONS.includes(value as typeof SEEDANCE_DURATION_OPTIONS[number])) return value
	return Math.min(SEEDANCE_DURATION_MAX, Math.max(SEEDANCE_DURATION_MIN, value))
}

const buildVideoParamsFromItem = (item: AiVideoResultItem): VideoGenerationParams => ({
	platformCode: item.platformCode,
	modelCode: item.modelCode,
	prompt: item.prompt || '',
	ratio: item.ratio || item.media?.ratio,
	resolution: item.resolution || item.media?.resolution,
	duration: item.duration ?? (item.media?.duration_ms ? Math.round(item.media.duration_ms / 1000) : undefined),
	generateAudio: item.generateAudio,
	userImages: parseUserImages(item.userImages),
})

const buildVideoParamsFromForm = (
	imageUrls: string[],
	codes: { platformCode: number; modelCode: number },
): VideoGenerationParams => ({
	platformCode: codes.platformCode,
	modelCode: codes.modelCode,
	prompt: prompt.value,
	ratio: selectedAspectRatio.value,
	resolution: selectedResolution.value,
	duration: selectedDuration.value,
	generateAudio: generateAudio.value,
	userImages: imageUrls,
})

const clearUploadedImages = () => {
	uploadedPreviews.value.forEach((url) => {
		if (url.startsWith('blob:')) URL.revokeObjectURL(url)
	})
	uploadedFiles.value = []
	uploadedPreviews.value = []
	uploadedImageUrls.value = []
	uploadedCount.value = 0
}

const setUploadedImageUrls = (urls: string[]) => {
	clearUploadedImages()
	uploadedPreviews.value = urls
	uploadedImageUrls.value = urls
	uploadedCount.value = urls.length
}

const applyVideoRetry = (record: VideoHistoryRecord) => {
	const params = record.params ?? { prompt: record.prompt }
	prompt.value = params.prompt || record.prompt

	if (params.ratio && SEEDANCE_RATIOS.includes(params.ratio as VideoAspectRatioValue)) {
		selectedAspectRatio.value = params.ratio as VideoAspectRatioValue
	}

	const resolution = normalizeVideoResolution(params.resolution)
	if (resolution) selectedResolution.value = resolution

	if (typeof params.duration === 'number' && params.duration >= SEEDANCE_DURATION_MIN && params.duration <= SEEDANCE_DURATION_MAX) {
		selectedDuration.value = params.duration
	} else if (record.duration && record.duration >= SEEDANCE_DURATION_MIN && record.duration <= SEEDANCE_DURATION_MAX) {
		selectedDuration.value = record.duration
	}

	if (typeof params.generateAudio === 'boolean') {
		generateAudio.value = params.generateAudio
	}

	const images = params.userImages?.filter(Boolean) ?? []
	if (images.length) {
		setUploadedImageUrls(images)
	} else {
		clearUploadedImages()
	}

	composerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const TEMPLATE_ASPECT_RATIOS: Record<string, VideoAspectRatioValue> = {
	people: '9:16',
	fashion: '9:16',
	scenery: '16:9',
	product: '1:1',
	whimsical: '1:1',
}

const applyTemplate = ({ card, category }: { card: TemplateCard; category: TemplateTabId }) => {
	prompt.value = card.prompt
	const ratio = TEMPLATE_ASPECT_RATIOS[category] ?? '1:1'
	if (SEEDANCE_RATIOS.includes(ratio)) {
		selectedAspectRatio.value = ratio
	}
	clearUploadedImages()
	composerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const mapResultToRecord = (item: AiVideoResultItem): VideoHistoryRecord => ({
	id: String(item.videoId ?? item.traceId ?? Date.now()),
	model: selectedModel.value.name,
	type: copy.value.recordTypeVideo,
	time: formatRecordTime(item.createTime),
	status: item.errorInfo ? 'failed' : item.media?.url ? 'success' : 'processing',
	prompt: item.prompt || '',
	video: item.media?.url || '',
	traceId: item.traceId,
	progress: item.media?.url ? 100 : 0,
	errorInfo: item.errorInfo,
	duration: item.duration ?? (item.media?.duration_ms ? Math.round(item.media.duration_ms / 1000) : undefined),
	params: buildVideoParamsFromItem(item),
})

const updateRecord = (id: string, patch: Partial<VideoHistoryRecord>) => {
	records.value = records.value.map(record => record.id === id ? { ...record, ...patch } : record)
}

const uploadSelectedFiles = async (files = uploadedFiles.value) => {
	if (!files.length) return []
	isUploading.value = true
	try {
		const urls = files.length > 1
			? await uploadAiImageFilesController(files)
			: await Promise.all(files.map(file => uploadAiImageFileController(file)))
		const resolvedUrls = urls.filter(Boolean)
		if (resolvedUrls.length !== files.length) {
			throw new Error(copy.value.generationFailed)
		}
		uploadedImageUrls.value = resolvedUrls
		return resolvedUrls
	} finally {
		isUploading.value = false
	}
}

const handleFiles = async (event: Event) => {
	const input = event.target as HTMLInputElement
	const files = [
		...uploadedFiles.value,
		...Array.from(input.files ?? []),
	].slice(0, 8)
	uploadedPreviews.value.forEach((url) => {
		if (url.startsWith('blob:')) URL.revokeObjectURL(url)
	})
	uploadedFiles.value = files
	uploadedPreviews.value = files.map(file => URL.createObjectURL(file))
	uploadedImageUrls.value = []
	uploadedCount.value = files.length
	input.value = ''
	if (files.length) {
		if (!isLoggedIn.value) {
			requestLogin()
			return
		}
		try {
			await uploadSelectedFiles(files)
		} catch (error) {
			if (isUnauthorizedError(error)) {
				requestLogin()
				return
			}
			throw error
		}
	}
}

const removeUploadedImage = (index: number) => {
	const preview = uploadedPreviews.value[index]
	if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
	uploadedFiles.value = uploadedFiles.value.filter((_, fileIndex) => fileIndex !== index)
	uploadedPreviews.value = uploadedPreviews.value.filter((_, previewIndex) => previewIndex !== index)
	uploadedImageUrls.value = uploadedImageUrls.value.filter((_, urlIndex) => urlIndex !== index)
	uploadedCount.value = uploadedFiles.value.length
}

const selectModel = (id: VideoModelId) => {
	selectedModelId.value = id
	modelPickerOpen.value = false
}

const getGenerationCodes = (hasImages: boolean) => hasImages
	? selectedModel.value.imageToVideo
	: selectedModel.value.textToVideo

const pollVideoResult = async (traceId: string, recordId: string) => {
	const startedAt = Date.now()
	const expectedDurationMs = 5 * 60 * 1000
	let progressTimer: ReturnType<typeof window.setInterval> | null = window.setInterval(() => {
		const elapsed = Date.now() - startedAt
		updateRecord(recordId, { progress: Math.min(96, Math.round((elapsed / expectedDurationMs) * 96)) })
	}, 2000)
	let result: AiVideoResultItem | null = null

	try {
		// Poll every 30s for up to ~15 minutes (video generation often takes ~5 minutes).
		for (let attempt = 0; attempt < 30; attempt++) {
			await sleep(30000)
			const response = await getAiVideoResultController(traceId)
			const item = response.data?.find(resultItem => resultItem.traceId === traceId) ?? response.data?.[0]
			if (item?.errorInfo) throw new Error(item.errorInfo)
			if (item?.media?.url) {
				result = item
				break
			}
		}

		if (!result) throw new Error(copy.value.stillPending)
		updateRecord(recordId, {
			...mapResultToRecord(result),
			id: recordId,
			model: selectedModel.value.name,
			status: 'success',
			progress: 100,
		})
	} catch (error) {
		updateRecord(recordId, {
			status: 'failed',
			progress: 100,
			errorInfo: error instanceof Error ? error.message : copy.value.generationFailed,
		})
	} finally {
		if (progressTimer) {
			window.clearInterval(progressTimer)
			progressTimer = null
		}
	}
}

const generateVideo = async () => {
	if (isUploading.value || isGenerating.value) return
	if (!isLoggedIn.value) {
		requestLogin()
		return
	}
	if ((user.value?.creditBalance ?? 0) < requiredCredits.value) {
		showTipToast({ title: t('aiVideoGenerator.insufficientCreditsTitle'), message: t('aiVideoGenerator.insufficientCreditsMessage', { count: requiredCredits.value }), type: 'error' })
		return
	}
	isGenerating.value = true
	try {
		const imageUrls = uploadedFiles.value.length
			? (
				uploadedImageUrls.value.length === uploadedFiles.value.length
					? uploadedImageUrls.value
					: await uploadSelectedFiles()
			)
			: uploadedImageUrls.value.filter(Boolean)
		const hasImages = imageUrls.length > 0
		const codes = getGenerationCodes(hasImages)
		const payload: GenerateAiVideoPayload = {
			platformCode: codes.platformCode,
			modelCode: codes.modelCode,
			prompt: prompt.value,
			ratio: selectedAspectRatio.value,
			resolution: selectedResolution.value,
			duration: selectedDuration.value,
			generateAudio: generateAudio.value,
			n: 1,
		}
		if (hasImages) {
			payload.images = imageUrls
		}
		const response = await generateAiVideoController(payload)
		const traceId = response.data.traceId
		const recordId = traceId || `trace-${Date.now()}`
		records.value = [
			{
				id: recordId,
				model: selectedModel.value.name,
				type: copy.value.recordTypeVideo,
				time: formatRecordTime(),
				status: 'processing',
				prompt: prompt.value,
				video: '',
				traceId,
				progress: 0,
				duration: selectedDuration.value,
				params: buildVideoParamsFromForm(imageUrls, codes),
			},
			...records.value,
		]
		await pollVideoResult(traceId, recordId)
	} catch (error) {
		if (isUnauthorizedError(error)) {
			requestLogin()
			return
		}
		throw error
	} finally {
		isGenerating.value = false
	}
}

const buildHistoryQuery = () => {
	const query: {
		pageNum: 1
		pageSize: 50
		startTime?: number
		endTime?: number
		prompt?: string
	} = {
		pageNum: 1,
		pageSize: 50,
	}
	const now = new Date()
	const promptQuery = searchQuery.value.trim()
	if (promptQuery) query.prompt = promptQuery

	if (timeFilter.value === 'today') {
		query.startTime = startOfDay(now).getTime()
		query.endTime = endOfDay(now).getTime()
		return query
	}

	if (timeFilter.value === 'week') {
		query.startTime = startOfWeek(now).getTime()
		query.endTime = endOfDay(now).getTime()
		return query
	}

	if (timeFilter.value === 'custom') {
		const parsedStart = parseAssetDate(startDate.value)
		const parsedEnd = parseAssetDate(endDate.value)
		if (parsedStart) query.startTime = startOfDay(parsedStart).getTime()
		if (parsedEnd) query.endTime = endOfDay(parsedEnd).getTime()
		return query
	}

	return query
}

let historyRequestId = 0
let historyFilterTimer: ReturnType<typeof setTimeout> | null = null
const loadHistory = async () => {
	const requestId = historyRequestId + 1
	historyRequestId = requestId
	if (!isLoggedIn.value) {
		historyAuthRequired.value = true
		records.value = []
		return
	}
	try {
		const response = await getAiVideoHistoryController(buildHistoryQuery())
		if (requestId !== historyRequestId) return
		const history = (response.rows ?? []).map(item => ({
			...mapResultToRecord(item),
			model: 'Seedance 2.0',
		}))
		historyAuthRequired.value = false
		records.value = history
	} catch (error) {
		if (requestId !== historyRequestId) return
		if (isUnauthorizedError(error)) {
			historyAuthRequired.value = true
			records.value = []
			return
		}
		throw error
	}
}

const consumeHomepageVideoHandoff = () => {
	if (!isLoggedIn.value) return
	const handoff = consumeCreationHandoff('video') as VideoCreationHandoff | null
	if (!handoff) return

	const params = handoff.params
	prompt.value = handoff.prompt || params.prompt
	if (params.ratio && SEEDANCE_RATIOS.includes(params.ratio as VideoAspectRatioValue)) {
		selectedAspectRatio.value = params.ratio as VideoAspectRatioValue
	}

	const resolution = normalizeVideoResolution(params.resolution)
	if (resolution) selectedResolution.value = resolution

	const duration = normalizeVideoDuration(params.duration)
	if (duration) selectedDuration.value = duration
	if (typeof params.generateAudio === 'boolean') generateAudio.value = params.generateAudio
	if (params.userImages?.length) setUploadedImageUrls(params.userImages)

	const existing = records.value.find(record => record.traceId === handoff.traceId)
	if (existing) {
		if (existing.status === 'processing') {
			updateRecord(existing.id, { progress: Math.max(4, existing.progress ?? 0) })
			void pollVideoResult(handoff.traceId, existing.id)
		}
		return
	}

	const recordId = handoff.traceId
	records.value = [
		{
			id: recordId,
			model: handoff.modelName,
			type: copy.value.recordTypeVideo,
			time: formatRecordTime(),
			status: 'processing',
			prompt: handoff.prompt,
			video: '',
			traceId: handoff.traceId,
			progress: 4,
			duration: params.duration,
			params,
		},
		...records.value,
	]
	void pollVideoResult(handoff.traceId, recordId)
}

const scheduleHistoryLoad = (delay = 0) => {
	if (historyFilterTimer) clearTimeout(historyFilterTimer)
	historyFilterTimer = setTimeout(() => {
		loadHistory().catch(() => {})
	}, delay)
}

const handleDocumentPointerDown = (event: PointerEvent) => {
	if (!modelPickerRef.value?.contains(event.target as Node)) {
		modelPickerOpen.value = false
	}
}

watch([timeFilter, startDate, endDate], () => {
	scheduleHistoryLoad()
})

watch(searchQuery, () => {
	scheduleHistoryLoad(300)
})

watch(isLoggedIn, (loggedIn) => {
	if (loggedIn) {
		loginOpen.value = false
		if (historyAuthRequired.value) {
			loadHistory().catch(() => {})
		}
	}
})

onMounted(() => {
	document.addEventListener('pointerdown', handleDocumentPointerDown)
	void loadHistory()
		.catch(() => {})
		.finally(() => {
			consumeHomepageVideoHandoff()
		})
})

onBeforeUnmount(() => {
	document.removeEventListener('pointerdown', handleDocumentPointerDown)
	if (historyFilterTimer) clearTimeout(historyFilterTimer)
	uploadedPreviews.value.forEach((url) => {
		if (url.startsWith('blob:')) URL.revokeObjectURL(url)
	})
})
</script>
