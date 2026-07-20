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
					active-mode="image"
					:creation-mode-label="copy.creationModeLabel"
					:ai-image-label="copy.aiImage"
					:ai-video-label="copy.aiVideo"
				/>

				<div ref="modelPickerRef" class="relative z-[8]">
					<button type="button" class="grid min-h-[58px] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[10px] border border-white/10 bg-[#131315] px-3 text-left text-white/50" :aria-expanded="modelPickerOpen" @click="modelPickerOpen = !modelPickerOpen">
						<AppModelBrandIcon :name="selectedModel.icon" />
						<span class="min-w-0">
							<strong class="block truncate text-[13px] font-[850] text-white/90">{{ selectedModel.name }}</strong>
							<small class="mt-[3px] block truncate text-[11px] font-semibold text-white/35">{{ selectedModel.desc }}</small>
						</span>
						<svg class="h-4 w-4 transition-transform duration-150" :class="{ 'rotate-180': modelPickerOpen }" viewBox="0 0 20 20" fill="none" aria-hidden="true">
							<path d="M5.5 8L10 12.5L14.5 8" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>

					<div v-if="modelPickerOpen" class="absolute left-0 right-0 top-[calc(100%+8px)] z-10 overflow-hidden rounded-xl border border-white/15 bg-[#151517] shadow-[0_22px_60px_rgba(0,0,0,0.56)]">
						<label class="flex h-12 items-center gap-2.5 border-b border-white/10 px-3.5 text-white/45">
							<svg class="h-[19px] w-[19px] shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
								<circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5" />
								<path d="M13.2 13.2L16.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
							</svg>
							<input v-model.trim="modelSearch" class="min-w-0 flex-1 bg-transparent text-[13px] text-white/85 outline-none placeholder:text-white/30" type="search" :placeholder="copy.modelSearchPlaceholder" />
						</label>

						<div class="grid max-h-[min(390px,56vh)] gap-1 overflow-y-auto p-2">
							<button
								v-for="model in filteredModels"
								:key="model.id"
								type="button"
								:class="[
									'grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-[10px] px-3 py-2.5 text-left text-white/60 hover:bg-white/10',
									model.id === selectedModelId ? 'bg-white/10' : 'bg-transparent',
								]"
								@click="selectModel(model.id)"
							>
								<AppModelBrandIcon :name="model.icon" />
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

				<div v-if="uploadedCount" class="flex min-h-[78px] flex-wrap items-center gap-3">
					<div v-for="(preview, index) in uploadedPreviews" :key="preview" class="relative h-[74px] w-[74px] overflow-hidden rounded-[14px] border border-white/15 bg-[#171719]">
						<img class="h-full w-full object-cover" :src="preview" :alt="t('aiImageGenerator.uploadedImageAlt', { index: index + 1 })" />
						<button type="button" class="absolute right-1 top-1 grid h-[18px] w-[18px] place-items-center rounded-full bg-black/55 text-base leading-none text-white/90 hover:bg-white hover:text-[#111]" :aria-label="t('aiImageGenerator.removeImage', { index: index + 1 })" @click="removeUploadedImage(index)">x</button>
						<span class="absolute bottom-1.5 left-2 grid h-[18px] min-w-[18px] place-items-center rounded-full bg-black/50 text-[11px] font-[850] leading-none text-white/80">{{ index + 1 }}</span>
					</div>
					<label v-if="uploadedCount < 8" class="relative grid h-[74px] w-[74px] cursor-pointer place-items-center content-center gap-1.5 overflow-hidden rounded-[14px] border border-dashed border-white/20 bg-[#171719] text-white/35 hover:border-white/35 hover:bg-[#1f1f21] hover:text-white/60">
						<input class="sr-only" type="file" multiple accept="image/png,image/jpeg,image/webp" @change="handleFiles" />
						<span class="text-2xl font-light leading-none" aria-hidden="true">+</span>
						<strong class="text-xs font-bold">{{ copy.add }}</strong>
					</label>
				</div>

				<label v-if="!uploadedCount" class="grid min-h-[clamp(132px,17vh,168px)] cursor-pointer place-items-center gap-2 rounded-[13px] border-2 border-dashed border-white/25 bg-[#202022] p-4 text-center text-white/35">
					<input class="sr-only" type="file" multiple accept="image/png,image/jpeg,image/webp" @change="handleFiles" />
					<svg class="h-[34px] w-[34px]" viewBox="0 0 28 28" fill="none" aria-hidden="true">
						<path d="M14 19V5.5M9.2 10.4L14 5.5L18.8 10.4" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
						<path d="M6.5 17.5V20.8A2.2 2.2 0 0 0 8.7 23H19.3A2.2 2.2 0 0 0 21.5 20.8V17.5" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" />
					</svg>
					<strong class="text-[13px] font-[850] text-white/50">{{ uploadedCount ? t('aiImageGenerator.imagesSelected', { count: uploadedCount }) : copy.uploadImages }}</strong>
					<span class="text-[11.5px] font-semibold">{{ copy.uploadHint }}</span>
				</label>

				<div class="grid min-h-[clamp(238px,32vh,310px)] grid-rows-[minmax(190px,1fr)_auto] overflow-hidden rounded-xl border border-white/10 bg-[#171719]">
					<textarea id="ai-image-prompt" v-model="prompt" class="min-h-0 w-full resize-none bg-transparent p-4 text-[12.5px] font-semibold leading-normal text-white/80 outline-none placeholder:text-white/30" maxlength="20000" :placeholder="copy.promptPlaceholder" />
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
						<div class="grid grid-cols-4 gap-2">
							<button v-for="ratio in aspectRatios" :key="ratio.value" type="button" :class="choiceButtonClass(selectedAspectRatio === ratio.value)" @click="selectedAspectRatio = ratio.value">
								{{ ratio.label }}
							</button>
						</div>
					</section>

					<section v-if="selectedModelProfile.supportsQuality" class="grid gap-2.5">
						<h3 class="m-0 text-[13px] font-[850] text-white/90">{{ copy.quality }}</h3>
						<div class="grid grid-cols-3 gap-2">
							<button v-for="quality in qualityOptions" :key="quality.value" type="button" :class="choiceButtonClass(selectedQuality === quality.value, 'min-h-[52px]')" @click="selectedQuality = quality.value">
								<strong class="block leading-tight">{{ quality.label }}</strong>
								<span class="mt-1 block text-[11px] font-bold leading-tight opacity-80">{{ quality.desc }}</span>
							</button>
						</div>
					</section>

					<section class="grid gap-2.5">
						<h3 class="m-0 text-[13px] font-[850] text-white/90">{{ copy.resolution }}</h3>
						<div class="grid grid-cols-3 gap-2">
							<button v-for="resolution in resolutionOptions" :key="resolution.value" type="button" :class="choiceButtonClass(selectedResolution === resolution.value, 'min-h-[52px]')" @click="selectedResolution = resolution.value">
								<strong class="block leading-tight">{{ resolution.label }}</strong>
								<span class="mt-1 block text-[11px] font-bold leading-tight opacity-80">{{ t('aiImageGenerator.creditsShort', { count: resolution.credits }) }}</span>
							</button>
						</div>
					</section>

					<section v-if="selectedModelProfile.supportsQuality" class="grid gap-2.5">
						<h3 class="m-0 text-[13px] font-[850] text-white/90">{{ copy.numberOfImages }}</h3>
						<div class="grid grid-cols-4 gap-2">
							<button v-for="count in imageCounts" :key="count" type="button" :class="choiceButtonClass(imageCount === count)" @click="imageCount = count">
								{{ count }}
							</button>
						</div>
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
						<em class="ml-auto not-italic text-white/70">{{ t('aiImageGenerator.credits', { count: requiredCredits }) }}</em>
					</div>
					<button type="button" class="inline-flex h-[46px] items-center justify-center gap-2.5 rounded-xl bg-white text-[13.5px] font-black text-[#151515] disabled:cursor-not-allowed disabled:opacity-60" :disabled="isUploading || isGenerating" @click="generateImage">
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
					:video-src="AI_IMAGE_TUTORIAL_VIDEO"
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
						:time="record.time"
						:prompt="record.prompt"
						:status="record.status"
						:media-src="record.image"
						media-type="image"
						:progress="record.progress"
						:processing-label="copy.generatingImage"
						:progress-label="record.progress !== undefined ? `${record.progress}%` : copy.preparingTask"
						:trace-label="record.traceId ? t('aiImageGenerator.traceId', { traceId: record.traceId }) : copy.preparingTask"
						:failed-title="copy.failed"
						:failed-message="copy.failedMessage"
						:error-info="record.errorInfo"
						:refunded-message="copy.refundedMessage"
						:retry-label="copy.retry"
						:delete-label="copy.delete"
						:open-label="copy.openAsset"
						:deleting="deletingIds.includes(record.id)"
						@open="selectedImage = record"
						@delete="requestDeleteRecord(record.id)"
						@retry="applyImageRetry(record)"
					/>
				</div>
				<div v-else class="grid min-h-[360px] place-items-center rounded-xl border border-dashed border-white/10 bg-white/[0.03] p-8 text-center">
					<div class="grid max-w-[360px] justify-items-center gap-3">
						<div class="grid h-14 w-14 place-items-center rounded-2xl border border-white/10 bg-[#111113] text-white/45" aria-hidden="true">
							<svg class="h-7 w-7" viewBox="0 0 24 24" fill="none">
								<rect x="4" y="5" width="16" height="14" rx="2.4" stroke="currentColor" stroke-width="1.6" />
								<path d="M6.8 15.7L10 12.4L12.3 14.5L14.5 12.2L17.4 15.7" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
								<path d="M8 8.6H8.01" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" />
							</svg>
						</div>
						<strong class="text-sm font-[850] text-white/80">{{ copy.emptyStateTitle }}</strong>
						<p class="m-0 text-xs font-semibold leading-relaxed text-white/40">{{ copy.emptyStateDescription }}</p>
					</div>
				</div>
				</template>
			</section>
		</main>

		<CreativePreviewModal :item="previewItem" @close="selectedImage = null" />
		<AppConfirmDialog
			:open="!!pendingDeleteId"
			:title="deleteDialogCopy.title"
			:message="deleteDialogCopy.message"
			:confirm-label="deleteDialogCopy.confirm"
			:cancel-label="deleteDialogCopy.cancel"
			:loading-label="deleteDialogCopy.loading"
			:loading="!!pendingDeleteId && deletingIds.includes(pendingDeleteId)"
			@cancel="pendingDeleteId = null"
			@confirm="confirmDeleteRecord"
		/>
		<LoginModal :open="loginOpen" @close="loginOpen = false" />
	</div>
</template>

<script setup lang="ts">
import {
	deleteAiImageController,
	generateAiImageController,
	getAiImageHistoryController,
	getAiImageResultController,
	uploadAiImageFileController,
	uploadAiImageFilesController,
	type GenerateAiImagePayload,
} from '~/api/ai-image'
import type { AiImageResultItem } from '~/api/ai-image'
import CreativePreviewModal from '~/components/home/CreativePreviewModal.vue'
import AppCreationTutorialsPanel from '~/components/home/app/AppCreationTutorialsPanel.vue'
import AppCreationTemplatesPanel from '~/components/home/app/AppCreationTemplatesPanel.vue'
import AppConfirmDialog from '~/components/home/app/AppConfirmDialog.vue'
import AppCreationModeSwitcher from '~/components/home/app/AppCreationModeSwitcher.vue'
import AppCreationToolbar from '~/components/home/app/AppCreationToolbar.vue'
import AppAuthRequiredState from '~/components/home/app/AppAuthRequiredState.vue'
import AppCreationRecordCard from '~/components/home/app/AppCreationRecordCard.vue'
import AppHomeSidebar from '~/components/home/app/AppHomeSidebar.vue'
import AppModelBrandIcon from '~/components/home/app/AppModelBrandIcon.vue'
import LoginModal from '~/components/auth/LoginModal.vue'
import {
	MODEL_PROFILES,
	getModelCredits,
	type CreationTabId,
	type AspectRatioValue,
	type QualityValue,
	type ResolutionValue,
	type HistoryRecord,
	type AiImageGeneratorCopy,
	type ImageModelId,
	type ImageModel,
	type ModelProfile,
	type ImageGenerationParams,
} from './AIimage'
import type { TemplateCard, TemplateTabId } from '~/utils/promptTemplates'
import { AI_IMAGE_TUTORIAL_VIDEO } from '~/utils/creationTutorials'
import { consumeCreationHandoff, type ImageCreationHandoff } from '~/utils/creationHandoff'

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
const sidebarCollapsed = ref(false)
const activeTab = ref<CreationTabId>('my-creations')
const searchQuery = ref('')
const timeFilter = ref('all')
const typeFilter = ref('all')
const modelSearch = ref('')
const modelPickerOpen = ref(false)
const modelPickerRef = ref<HTMLElement | null>(null)
const composerRef = ref<HTMLElement | null>(null)
const isUploading = ref(false)
const isGenerating = ref(false)
const historyAuthRequired = ref(false)
const isLoggedIn = computed(() => Boolean(token.value && user.value))
const showAuthRequired = computed(() => historyAuthRequired.value || !isLoggedIn.value)
const loginOpen = ref(false)
const imageCount = ref(1)
const uploadedCount = ref(0)
const uploadedFiles = ref<File[]>([])
const uploadedPreviews = ref<string[]>([])
const uploadedImageUrls = ref<string[]>([])
const selectedModelId = ref<ImageModelId>('gpt-image-2')
const selectedAspectRatio = ref<AspectRatioValue>('auto')
const selectedQuality = ref<QualityValue>('medium')
const selectedResolution = ref<ResolutionValue>('1K')
const selectedImage = ref<HistoryRecord | null>(null)
const pendingDeleteId = ref<string | null>(null)
const deletingIds = ref<string[]>([])
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

const copy = computed(() => t('aiImageGenerator') as AiImageGeneratorCopy)
const toolbarCopy = computed(() => t('assets') as ToolbarCopy)
const customTimeLabel = computed(() => locale.value === 'zh' ? '自定义' : 'Custom')
const deleteDialogCopy = computed(() => locale.value === 'zh'
	? {
			title: '删除AI生图记录',
			message: '删除后该记录将从当前账号移除，且不可恢复。',
			confirm: '确认删除',
			cancel: '取消',
			loading: '删除中...',
		}
	: {
			title: 'Delete AI image record',
			message: 'This record will be removed from your account and cannot be restored.',
			confirm: 'Delete',
			cancel: 'Cancel',
			loading: 'Deleting...',
		})
const selectedTimeLabel = computed(() => toolbarCopy.value.timeFilters.find(option => option.value === timeFilter.value)?.label ?? (timeFilter.value === 'custom' ? customTimeLabel.value : copy.value.allTime))
const selectedTypeLabel = computed(() => toolbarCopy.value.typeFilters.find(option => option.value === typeFilter.value)?.label ?? copy.value.allTypes)
const tabs = computed<Array<{ id: CreationTabId; label: string }>>(() => [
	{ id: 'my-creations', label: copy.value.myCreations },
	{ id: 'templates', label: copy.value.templates },
	{ id: 'tutorials', label: copy.value.tutorials },
])
const imageModels: ImageModel[] = [
	{
		id: 'gpt-image-2',
		name: 'GPT Image 2',
		desc: '',
		credits: '',
		icon: 'openai',
		profile: 'gpt-image',
		textToImage: { platformCode: 2, modelCode: 3 },
		imageToImage: { platformCode: 2, modelCode: 4 },
	},
	{
		id: 'nano-banana-2',
		name: 'Seedream 4.5',
		desc: '',
		credits: '',
		icon: 'seedream',
		profile: 'seedream',
		textToImage: { platformCode: 2, modelCode: 1 },
		imageToImage: { platformCode: 2, modelCode: 2 },
	},
	{
		id: 'seedream-4-5',
		name: 'Seedream 4.5',
		desc: '',
		credits: '',
		icon: 'seedream',
		profile: 'seedream',
		textToImage: { platformCode: 1, modelCode: 1 },
		imageToImage: { platformCode: 1, modelCode: 2 },
	},
	{
		id: 'nano-banana-pro',
		name: 'Nano Banana Pro',
		desc: '',
		credits: '',
		icon: 'google',
		profile: 'seedream',
		textToImage: { platformCode: 1, modelCode: 1 },
		imageToImage: { platformCode: 1, modelCode: 2 },
	},
	{
		id: 'nano-banana',
		name: 'Nano Banana',
		desc: '',
		credits: '',
		icon: 'google',
		profile: 'seedream',
		textToImage: { platformCode: 1, modelCode: 1 },
		imageToImage: { platformCode: 1, modelCode: 2 },
	},
]
const choiceButtonClass = (active: boolean, minHeight = 'min-h-[38px]') => [
	'grid min-w-0 place-items-center rounded-[9px] border px-2 text-[13px] font-[850] transition-colors',
	minHeight,
	active
		? 'border-white/20 bg-[#3a3a3d] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
		: 'border-white/10 bg-[#1f1f21] text-white/60 hover:border-white/20 hover:bg-[#252527] hover:text-white/80',
]
const selectedModelProfile = computed(() => MODEL_PROFILES[selectedModel.value.profile])
const aspectRatios = computed<Array<{ label: string; value: AspectRatioValue }>>(() => {
	const ratios = selectedModelProfile.value.supportedRatios.map(value => ({ label: value, value }))
	if (selectedModelProfile.value.supportsAutoRatio) {
		return [{ label: copy.value.autoRatio, value: 'auto' as AspectRatioValue }, ...ratios]
	}
	return ratios
})
const localizedImageModels = computed(() => imageModels.map(model => ({
	...model,
	desc: copy.value.models[model.id]?.desc ?? model.name,
	credits: copy.value.models[model.id]?.credits ?? '',
})))
const qualityOptions = computed<Array<{ label: string; value: QualityValue; desc: string }>>(() => [
	{ label: copy.value.qualities.low.label, value: 'low', desc: copy.value.qualities.low.desc },
	{ label: copy.value.qualities.medium.label, value: 'medium', desc: copy.value.qualities.medium.desc },
	{ label: copy.value.qualities.high.label, value: 'high', desc: copy.value.qualities.high.desc },
])
const resolutionOptions = computed<Array<{ label: ResolutionValue; value: ResolutionValue; credits: number }>>(() => {
	const hasImages = uploadedCount.value > 0
	return selectedModelProfile.value.supportedResolutions.map(value => ({
		label: value,
		value,
		credits: getModelCredits(
			selectedModel.value.profile,
			selectedQuality.value,
			value,
			hasImages,
			1,
		),
	}))
})
const imageCounts = [1, 2, 3, 4]
const selectedModel = computed(() => localizedImageModels.value.find(model => model.id === selectedModelId.value) ?? localizedImageModels.value[0])
const filteredModels = computed(() => {
	const query = modelSearch.value.toLowerCase()
	if (!query) return localizedImageModels.value
	return localizedImageModels.value.filter(model => `${model.name} ${model.desc}`.toLowerCase().includes(query))
})
const requiredCredits = computed(() => getModelCredits(
	selectedModel.value.profile,
	selectedQuality.value,
	selectedResolution.value,
	uploadedCount.value > 0,
	imageCount.value,
))

const records = ref<HistoryRecord[]>([])

const visibleRecords = computed(() => {
	const rangeStart = timeFilter.value === 'custom' ? parseAssetDate(startDate.value) : null
	const rangeEnd = timeFilter.value === 'custom' ? parseAssetDate(endDate.value) : null
	const now = new Date()
	const weekStart = new Date(now)
	weekStart.setDate(now.getDate() - 7)
	const fallbackYear = rangeStart?.getFullYear() ?? rangeEnd?.getFullYear() ?? now.getFullYear()

	return records.value.filter((record) => {
		if (typeFilter.value !== 'all' && typeFilter.value !== 'image') return false

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

const previewItem = computed(() => selectedImage.value ? {
	id: selectedImage.value.id,
	title: selectedImage.value.prompt,
	image: selectedImage.value.image,
	alt: selectedImage.value.prompt,
	prompt: selectedImage.value.prompt,
	model: selectedImage.value.model,
	resolution: selectedResolution.value,
	aspectRatio: selectedAspectRatio.value === 'auto' ? '1:1' : selectedAspectRatio.value,
	outputFormat: 'PNG',
} : null)

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
const getModelNameFromCodes = (platformCode?: number, modelCode?: number) => {
	const match = imageModels.find((model) => {
		const codes = [model.textToImage, model.imageToImage]
		return codes.some(code => code.platformCode === platformCode && code.modelCode === modelCode)
	})
	return match?.name ?? copy.value.fallbackModelName
}
const getModelIdFromCodes = (platformCode?: number, modelCode?: number) => imageModels.find((model) => {
	const codes = [model.textToImage, model.imageToImage]
	return codes.some(code => code.platformCode === platformCode && code.modelCode === modelCode)
})?.id
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
const normalizeImageResolution = (value?: string): ResolutionValue | undefined => {
	if (!value) return undefined
	const normalized = value.toUpperCase()
	if (normalized === '1K' || normalized === '2K' || normalized === '4K') return normalized
	return undefined
}
const buildImageParamsFromItem = (item: AiImageResultItem): ImageGenerationParams => ({
	modelId: getModelIdFromCodes(item.platformCode, item.modelCode),
	platformCode: item.platformCode,
	modelCode: item.modelCode,
	prompt: item.prompt || '',
	ratio: item.ratio || item.media?.ratio,
	resolution: item.resolution || item.media?.resolution,
	quality: item.quality,
	imageCount: item.n,
	userImages: parseUserImages(item.userImages),
})
const buildImageParamsFromForm = (
	imageUrls: string[],
	codes: { platformCode: number; modelCode: number },
): ImageGenerationParams => ({
	modelId: selectedModelId.value,
	platformCode: codes.platformCode,
	modelCode: codes.modelCode,
	prompt: prompt.value,
	ratio: selectedAspectRatio.value === 'auto' ? '1:1' : selectedAspectRatio.value,
	resolution: selectedResolution.value.toLowerCase(),
	quality: selectedModel.value.profile === 'gpt-image' ? selectedQuality.value : undefined,
	imageCount: imageCount.value,
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
const applyImageRetry = (record: HistoryRecord) => {
	const params = record.params ?? { prompt: record.prompt }
	prompt.value = params.prompt || record.prompt

	if (params.modelId) {
		selectModel(params.modelId)
	} else if (params.platformCode !== undefined && params.modelCode !== undefined) {
		const modelId = getModelIdFromCodes(params.platformCode, params.modelCode)
		if (modelId) selectModel(modelId)
	}

	if (params.ratio) {
		const profile = MODEL_PROFILES[selectedModel.value.profile]
		const ratio = params.ratio as AspectRatioValue
		if (profile.supportedRatios.includes(ratio) || (ratio === 'auto' && profile.supportsAutoRatio)) {
			selectedAspectRatio.value = ratio
		}
	}

	const resolution = normalizeImageResolution(params.resolution)
	if (resolution) selectedResolution.value = resolution

	if (params.quality) selectedQuality.value = params.quality
	if (params.imageCount) imageCount.value = params.imageCount

	if (params.userImages?.length) {
		setUploadedImageUrls(params.userImages)
	} else {
		clearUploadedImages()
	}

	composerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}

const TEMPLATE_ASPECT_RATIOS: Record<string, AspectRatioValue> = {
	people: '9:16',
	fashion: '9:16',
	scenery: '16:9',
	product: '1:1',
	whimsical: '1:1',
}

const applyTemplate = ({ card, category }: { card: TemplateCard; category: TemplateTabId }) => {
	prompt.value = card.prompt
	const ratio = TEMPLATE_ASPECT_RATIOS[category] ?? '1:1'
	const profile = MODEL_PROFILES[selectedModel.value.profile]
	if (profile.supportedRatios.includes(ratio)) {
		selectedAspectRatio.value = ratio
	}
	clearUploadedImages()
	composerRef.value?.scrollIntoView({ behavior: 'smooth', block: 'start' })
}
const ensureModelOptions = (profile: ModelProfile) => {
	const config = MODEL_PROFILES[profile]
	if (!config.supportedRatios.includes(selectedAspectRatio.value) && !(config.supportsAutoRatio && selectedAspectRatio.value === 'auto')) {
		selectedAspectRatio.value = config.supportedRatios[0]
	}
	if (!config.supportedResolutions.includes(selectedResolution.value)) {
		selectedResolution.value = config.supportedResolutions[0]
	}
}
const mapResultToRecord = (item: AiImageResultItem): HistoryRecord => ({
	id: String(item.imageId ?? item.traceId ?? item.media?.mediaId ?? Date.now()),
	model: getModelNameFromCodes(item.platformCode, item.modelCode),
	type: copy.value.recordTypeImage,
	time: formatRecordTime(item.updateTime || item.createTime || item.media?.createTime),
	status: item.errorInfo ? 'failed' : item.media?.url ? 'success' : 'processing',
	prompt: item.prompt || '',
	image: item.media?.url || '',
	traceId: item.traceId,
	progress: item.media?.url ? 100 : 0,
	errorInfo: item.errorInfo,
	params: buildImageParamsFromItem(item),
})
const updateRecord = (id: string, patch: Partial<HistoryRecord>) => {
	records.value = records.value.map(record => record.id === id ? { ...record, ...patch } : record)
}
const requestDeleteRecord = (id: string) => {
	if (deletingIds.value.includes(id)) return
	pendingDeleteId.value = id
}
const confirmDeleteRecord = async () => {
	const id = pendingDeleteId.value
	if (!id || deletingIds.value.includes(id)) return

	deletingIds.value = [...deletingIds.value, id]
	try {
		await deleteAiImageController(id)
		records.value = records.value.filter(record => record.id !== id)
		if (selectedImage.value?.id === id) selectedImage.value = null
		pendingDeleteId.value = null
	} finally {
		deletingIds.value = deletingIds.value.filter(deletingId => deletingId !== id)
	}
}
const getRecordProgress = (recordId: string) => records.value.find(record => record.id === recordId)?.progress ?? 0
const uploadSingleFile = async (file: File) => {
	return uploadAiImageFileController(file)
}
const uploadMultipleFiles = async (files: File[]) => {
	return uploadAiImageFilesController(files)
}
const uploadSelectedFiles = async (files = uploadedFiles.value) => {
	if (!files.length) return []
	isUploading.value = true
	try {
		const urls = files.length > 1
			? await uploadMultipleFiles(files)
			: await Promise.all(files.map(file => uploadSingleFile(file)))
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
const handleFiles = (event: Event) => {
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
}
const removeUploadedImage = (index: number) => {
	const preview = uploadedPreviews.value[index]
	if (preview?.startsWith('blob:')) URL.revokeObjectURL(preview)
	uploadedFiles.value = uploadedFiles.value.filter((_, fileIndex) => fileIndex !== index)
	uploadedPreviews.value = uploadedPreviews.value.filter((_, previewIndex) => previewIndex !== index)
	uploadedImageUrls.value = uploadedImageUrls.value.filter((_, urlIndex) => urlIndex !== index)
	uploadedCount.value = uploadedFiles.value.length
}

const selectModel = (id: ImageModelId) => {
	selectedModelId.value = id
	const model = imageModels.find(item => item.id === id)
	if (model) ensureModelOptions(model.profile)
	modelPickerOpen.value = false
	modelSearch.value = ''
}

const getGenerationCodes = (hasImages: boolean) => hasImages
	? selectedModel.value.imageToImage
	: selectedModel.value.textToImage
let isUnmounted = false
const activePollTraceIds = new Set<string>()
const activeProgressTimers = new Map<string, ReturnType<typeof window.setInterval>>()
const pollImageResult = async (traceId: string, recordId: string) => {
	if (!traceId || activePollTraceIds.has(traceId)) return

	activePollTraceIds.add(traceId)
	const initialProgress = Math.min(getRecordProgress(recordId), 96)
	const startedAt = Date.now() - Math.round((initialProgress / 96) * 20000)
	const progressTimer: ReturnType<typeof window.setInterval> = window.setInterval(() => {
		if (isUnmounted) return
		const elapsed = Date.now() - startedAt
		updateRecord(recordId, { progress: Math.min(96, Math.round((elapsed / 20000) * 96)) })
	}, 600)
	activeProgressTimers.set(traceId, progressTimer)
	let result: AiImageResultItem | null = null

	try {
		for (let attempt = 0; attempt < 60; attempt++) {
			if (isUnmounted) return
			await sleep(2500)
			const response = await getAiImageResultController(traceId)
			const item = response.data?.find(resultItem => resultItem.traceId === traceId) ?? response.data?.[0]
			if (item?.errorInfo) throw new Error(item.errorInfo)
			if (item?.media?.url) {
				result = item
				break
			}
		}

		if (!result) throw new Error(copy.value.stillPending)
		const remainingFakeTime = Math.max(0, 20000 - (Date.now() - startedAt))
		if (remainingFakeTime) await sleep(remainingFakeTime)
		updateRecord(recordId, {
			...mapResultToRecord(result),
			id: recordId,
			model: records.value.find(record => record.id === recordId)?.model ?? getModelNameFromCodes(result.platformCode, result.modelCode),
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
		window.clearInterval(progressTimer)
		activeProgressTimers.delete(traceId)
		activePollTraceIds.delete(traceId)
	}
}
const generateImage = async () => {
	if (isUploading.value || isGenerating.value) return
	if (!isLoggedIn.value) {
		requestLogin()
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
		const payload: GenerateAiImagePayload = {
			prompt: prompt.value,
			images: imageUrls,
			ratio: selectedAspectRatio.value === 'auto' ? '1:1' : selectedAspectRatio.value,
			resolution: selectedResolution.value.toLowerCase(),
			platformCode: codes.platformCode,
			modelCode: codes.modelCode,
			n: selectedModel.value.profile === 'seedream' ? 1 : imageCount.value,
		}
		if (selectedModel.value.profile === 'gpt-image') {
			payload.quality = selectedQuality.value
		}
		const response = await generateAiImageController(payload)
		const traceId = response.data.traceId
		const recordId = traceId || `trace-${Date.now()}`
		records.value = [
			{
				id: recordId,
				model: selectedModel.value.name,
				type: copy.value.recordTypeImage,
				time: formatRecordTime(),
				status: 'processing',
				prompt: prompt.value,
				image: '',
				traceId,
				progress: 0,
				params: buildImageParamsFromForm(imageUrls, codes),
			},
			...records.value,
		]
		await pollImageResult(traceId, recordId)
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
		pageNum: 1,
		pageSize: 50,
		startTime?: number
		endTime?: number
		prompt?: string
	} = {
		pageNum: 1,
		pageSize: 50,
	}
	const now = new Date()
	const prompt = searchQuery.value.trim()
	if (prompt) query.prompt = prompt

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
		const response = await getAiImageHistoryController(buildHistoryQuery())
		if (requestId !== historyRequestId) return
		const history = (response.rows ?? []).map(mapResultToRecord)

		historyAuthRequired.value = false
		records.value = history
		resumePendingHistoryPolling(history)
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

const resumePendingHistoryPolling = (history: HistoryRecord[]) => {
	history
		.filter(record => record.status === 'processing' && record.traceId)
		.forEach((record) => {
			updateRecord(record.id, {
				progress: Math.max(8, record.progress ?? 0),
			})
			void pollImageResult(record.traceId as string, record.id)
		})
}

const isImageModelId = (value?: string): value is ImageModelId => {
	return Boolean(value && imageModels.some(model => model.id === value))
}

const consumeHomepageImageHandoff = () => {
	const handoff = consumeCreationHandoff('image') as ImageCreationHandoff | null
	if (!handoff) return

	const params = handoff.params
	prompt.value = handoff.prompt || params.prompt
	if (handoff.intent === 'template') {
		activeTab.value = 'templates'
		if (handoff.templateCategoryId) {
			void useAiTemplateStore().selectCategory(handoff.templateCategoryId)
		}
	}
	if (isImageModelId(params.modelId)) selectModel(params.modelId)

	const ratio = params.ratio as AspectRatioValue | undefined
	if (ratio) {
		const profile = MODEL_PROFILES[selectedModel.value.profile]
		if (profile.supportedRatios.includes(ratio) || (ratio === 'auto' && profile.supportsAutoRatio)) {
			selectedAspectRatio.value = ratio
		}
	}

	const resolution = normalizeImageResolution(params.resolution)
	if (resolution) selectedResolution.value = resolution
	if (params.quality) selectedQuality.value = params.quality
	if (params.imageCount) imageCount.value = params.imageCount
	if (params.userImages?.length) setUploadedImageUrls(params.userImages)
	if (handoff.intent === 'template' || !isLoggedIn.value) return

	const existing = records.value.find(record => record.traceId === handoff.traceId)
	if (existing) {
		if (existing.status === 'processing') {
			updateRecord(existing.id, { progress: Math.max(8, existing.progress ?? 0) })
			void pollImageResult(handoff.traceId, existing.id)
		}
		return
	}

	const recordId = handoff.traceId
	records.value = [
		{
			id: recordId,
			model: handoff.modelName,
			type: copy.value.recordTypeImage,
			time: formatRecordTime(),
			status: 'processing',
			prompt: handoff.prompt,
			image: '',
			traceId: handoff.traceId,
			progress: 8,
			params: params as ImageGenerationParams,
		},
		...records.value,
	]
	void pollImageResult(handoff.traceId, recordId)
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

watch(selectedModelId, (id) => {
	const model = imageModels.find(item => item.id === id)
	if (model) ensureModelOptions(model.profile)
}, { immediate: true })

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
	isUnmounted = false
	document.addEventListener('pointerdown', handleDocumentPointerDown)
	void loadHistory()
		.catch(() => {})
		.finally(() => {
			consumeHomepageImageHandoff()
		})
})

onBeforeUnmount(() => {
	isUnmounted = true
	document.removeEventListener('pointerdown', handleDocumentPointerDown)
	if (historyFilterTimer) clearTimeout(historyFilterTimer)
	activeProgressTimers.forEach(timer => window.clearInterval(timer))
	activeProgressTimers.clear()
	activePollTraceIds.clear()
	uploadedPreviews.value.forEach((url) => {
		if (url.startsWith('blob:')) URL.revokeObjectURL(url)
	})
})
</script>
