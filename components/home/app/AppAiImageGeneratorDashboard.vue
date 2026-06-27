<template>
	<div
		:class="[
			'grid min-h-screen bg-[#050505] text-[#f5f5f5] transition-[grid-template-columns] duration-200',
			sidebarCollapsed ? 'grid-cols-[84px_minmax(0,1fr)]' : 'grid-cols-[288px_minmax(0,1fr)]',
		]"
	>
		<AppHomeSidebar :collapsed="sidebarCollapsed" @toggle-collapse="sidebarCollapsed = !sidebarCollapsed" />

		<main class="grid h-dvh min-w-0 grid-cols-[clamp(390px,34vw,560px)_minmax(0,1fr)] overflow-hidden max-xl:grid-cols-[clamp(360px,40vw,500px)_minmax(0,1fr)] max-[1120px]:h-auto max-[1120px]:grid-cols-1 max-[1120px]:overflow-visible">
			<section class="flex min-w-0 flex-col gap-3.5 overflow-y-auto border-r border-white/10 bg-[#101012] px-[22px] pt-4 max-[1120px]:h-auto max-[1120px]:border-b max-[1120px]:border-r-0" :aria-label="copy.composerLabel">
				<div class="grid grid-cols-2 rounded-[11px] border border-white/10 bg-[#151515] p-[3px]" role="tablist" :aria-label="copy.creationModeLabel">
					<button type="button" class="inline-flex h-[34px] items-center justify-center gap-2 rounded-lg bg-[#3b3b3d] text-[12.5px] font-extrabold text-white/90 shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]" role="tab" aria-selected="true">
						<svg class="h-[15px] w-[15px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
							<rect x="3.5" y="4" width="13" height="12" rx="1.6" stroke="currentColor" stroke-width="1.5" />
							<path d="M5.5 13.5L8 10.8L10 12.6L11.7 10.8L14.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
						{{ copy.aiImage }}
					</button>
					<button type="button" class="inline-flex h-[34px] items-center justify-center gap-2 rounded-lg text-[12.5px] font-extrabold text-white/40" role="tab" aria-selected="false">
						<svg class="h-[15px] w-[15px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
							<rect x="3" y="6.5" width="9.5" height="7" rx="1.4" stroke="currentColor" stroke-width="1.5" />
							<path d="M12.5 8.5L17 6.5V13.5L12.5 11.5V8.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
						</svg>
						{{ copy.aiVideo }}
					</button>
				</div>

				<div ref="modelPickerRef" class="relative z-[8]">
					<button type="button" class="grid min-h-[58px] w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2.5 rounded-[10px] border border-white/10 bg-[#131315] px-3 text-left text-white/50" :aria-expanded="modelPickerOpen" @click="modelPickerOpen = !modelPickerOpen">
						<span :class="modelIconClass(selectedModel.icon)" aria-hidden="true">
							<svg v-if="selectedModel.icon === 'openai'" class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none">
								<circle cx="12" cy="12" r="7.8" stroke="currentColor" stroke-width="1.6" />
								<path d="M8.8 8.7C9.8 7.7 11 7.2 12.4 7.4C14.6 7.6 16.3 9.4 16.1 11.6C15.9 13.9 14 15.5 11.8 15.3C9.7 15.1 8.1 13.6 7.8 11.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
								<path d="M11.9 9.4C13.1 9.4 14 10.3 14 11.5C14 12.7 13.1 13.6 11.9 13.6C10.7 13.6 9.8 12.7 9.8 11.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
							</svg>
							<svg v-else-if="selectedModel.icon === 'google'" class="h-[22px] w-[22px]" viewBox="0 0 24 24" aria-hidden="true">
								<path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4c-.2 1.2-.9 2.2-2 2.9v2.4h3.2c1.9-1.7 3-4.2 3-7Z" />
								<path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.4c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.5-4.1H3.2v2.5C4.8 19.7 8.1 22 12 22Z" />
								<path fill="#FBBC05" d="M6.5 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.6H3.2C2.4 8.9 2 10.4 2 12s.4 3.1 1.2 4.4l3.3-2.5Z" />
								<path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.8-2.8C17 3 14.7 2 12 2 8.1 2 4.8 4.3 3.2 7.6l3.3 2.5C7.2 7.7 9.4 6 12 6Z" />
							</svg>
							<span v-else>S</span>
						</span>
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
								<span :class="modelIconClass(model.icon)" aria-hidden="true">
									<svg v-if="model.icon === 'openai'" class="h-[22px] w-[22px]" viewBox="0 0 24 24" fill="none">
										<circle cx="12" cy="12" r="7.8" stroke="currentColor" stroke-width="1.6" />
										<path d="M8.8 8.7C9.8 7.7 11 7.2 12.4 7.4C14.6 7.6 16.3 9.4 16.1 11.6C15.9 13.9 14 15.5 11.8 15.3C9.7 15.1 8.1 13.6 7.8 11.6" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
										<path d="M11.9 9.4C13.1 9.4 14 10.3 14 11.5C14 12.7 13.1 13.6 11.9 13.6C10.7 13.6 9.8 12.7 9.8 11.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
									</svg>
									<svg v-else-if="model.icon === 'google'" class="h-[22px] w-[22px]" viewBox="0 0 24 24" aria-hidden="true">
										<path fill="#4285F4" d="M21.6 12.2c0-.7-.1-1.3-.2-1.9H12v3.6h5.4c-.2 1.2-.9 2.2-2 2.9v2.4h3.2c1.9-1.7 3-4.2 3-7Z" />
										<path fill="#34A853" d="M12 22c2.7 0 5-.9 6.6-2.5l-3.2-2.4c-.9.6-2 .9-3.4.9-2.6 0-4.8-1.7-5.5-4.1H3.2v2.5C4.8 19.7 8.1 22 12 22Z" />
										<path fill="#FBBC05" d="M6.5 13.9c-.2-.6-.3-1.2-.3-1.9s.1-1.3.3-1.9V7.6H3.2C2.4 8.9 2 10.4 2 12s.4 3.1 1.2 4.4l3.3-2.5Z" />
										<path fill="#EA4335" d="M12 6c1.5 0 2.8.5 3.9 1.5l2.8-2.8C17 3 14.7 2 12 2 8.1 2 4.8 4.3 3.2 7.6l3.3 2.5C7.2 7.7 9.4 6 12 6Z" />
									</svg>
									<span v-else>S</span>
								</span>
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

					<section class="grid gap-2.5">
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

					<section class="grid gap-2.5">
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
					v-model:search="searchQuery"
					:time-label="copy.allTime"
					:type-label="copy.allTypes"
					:search-label="copy.searchPlaceholder"
					:search-placeholder="copy.searchPlaceholder"
					:select-label="copy.selectCreations"
				/>

				<div v-if="visibleRecords.length" class="grid gap-3">
					<article v-for="record in visibleRecords" :key="record.id" class="overflow-hidden rounded-xl border border-white/10 bg-[#0a0a0b] p-3.5">
						<header class="flex min-h-6 items-center justify-between gap-3">
							<div class="flex flex-wrap items-center gap-2 text-[11.5px] font-bold text-white/35">
								<strong class="font-[820] text-white/55">{{ record.model }}</strong>
								<span class="rounded bg-white/10 px-1.5 py-0.5 text-[9.5px] font-black text-white/45">{{ record.type }}</span>
								<time>{{ record.time }}</time>
							</div>
							<button v-if="record.status === 'success'" type="button" class="grid h-6 w-6 place-items-center rounded-full bg-[#ffd60a]/10 text-[#f6c400]" :aria-label="copy.openAsset">
								<svg class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="none" aria-hidden="true">
									<path d="M5.5 4.5H10L11.4 6H15A1.5 1.5 0 0 1 16.5 7.5V14A1.5 1.5 0 0 1 15 15.5H5A1.5 1.5 0 0 1 3.5 14V6A1.5 1.5 0 0 1 5 4.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
								</svg>
							</button>
						</header>
						<p class="my-3 text-xs font-semibold leading-normal text-white/50">{{ record.prompt }}</p>
						<div v-if="record.status === 'processing'" class="grid gap-2.5 rounded-[10px] border border-white/10 bg-white/[0.045] p-3">
							<div class="flex items-center justify-between gap-3 text-xs font-[850] text-white/80">
								<strong>{{ copy.generatingImage }}</strong>
								<span class="text-white/50">{{ record.progress !== undefined ? record.progress + '%' : copy.preparingTask }}</span>
							</div>
							<div class="h-2 overflow-hidden rounded-full bg-white/10" aria-hidden="true">
								<span v-if="record.progress !== undefined" class="block h-full rounded-full bg-gradient-to-r from-[#5b5b60] to-[#f5f5f5] transition-[width] duration-500" :style="{ width: record.progress + '%' }"></span>
								<span v-else class="block h-full w-1/3 animate-pulse rounded-full bg-white/60"></span>
							</div>
							<small class="truncate text-[10.5px] font-semibold text-white/35">{{ record.traceId ? t('aiImageGenerator.traceId', { traceId: record.traceId }) : copy.preparingTask }}</small>
						</div>
						<div v-else-if="record.status === 'failed'" class="rounded-[10px] border border-red-500/35 bg-red-950/20 p-3 text-white/50">
							<strong class="inline-flex items-center gap-2 text-[11.5px] font-[850] text-[#ff5b5b]">
								<svg class="h-[15px] w-[15px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
									<circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.6" />
									<path d="M10 5.8V10.5M10 14.2H10.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
								</svg>
								{{ copy.failed }}
							</strong>
							<p class="my-2.5 text-[11.5px] font-semibold leading-normal">{{ record.errorInfo || copy.failedMessage }}</p>
							<small class="block text-[10.5px] font-semibold text-white/30">{{ copy.refundedMessage }}</small>
							<div class="mt-3 grid grid-cols-[minmax(0,1fr)_34px] gap-2">
								<button type="button" class="inline-flex h-[30px] items-center justify-center gap-1.5 rounded-lg bg-white/10 text-[11.5px] font-bold text-white/55">
									<svg class="h-[15px] w-[15px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
										<path d="M15.5 9.5A5.5 5.5 0 1 1 14 5.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
										<path d="M14.4 3.2V6.3H11.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
									{{ copy.retry }}
								</button>
								<button type="button" class="grid h-[30px] place-items-center rounded-lg bg-red-500/15 text-red-500" :aria-label="copy.delete">
									<svg class="h-[15px] w-[15px]" viewBox="0 0 20 20" fill="none" aria-hidden="true">
										<path d="M7.5 4.5H12.5M4.5 6.5H15.5M6 6.5L6.6 15A1.5 1.5 0 0 0 8.1 16.4H11.9A1.5 1.5 0 0 0 13.4 15L14 6.5M8.6 9V14M11.4 9V14" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" />
									</svg>
								</button>
							</div>
						</div>
						<button v-else type="button" class="block w-[min(260px,48%)] max-w-full overflow-hidden rounded-lg bg-[#141414]" @click="selectedImage = record">
							<NuxtImg class="block aspect-square w-full object-cover" :src="record.image" :alt="record.prompt" />
						</button>
					</article>
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
			</section>
		</main>

		<CreativePreviewModal :item="previewItem" @close="selectedImage = null" />
	</div>
</template>

<script setup lang="ts">
import {
	generateAiImageController,
	getAiImageHistoryController,
	getAiImageResultController,
	uploadAiImageFileController,
	uploadAiImageFilesController,
} from '~/api/ai-image'
import type { AiImageResultItem } from '~/api/ai-image'
import CreativePreviewModal from '~/components/home/CreativePreviewModal.vue'
import AppCreationToolbar from '~/components/home/app/AppCreationToolbar.vue'
import AppHomeSidebar from '~/components/home/app/AppHomeSidebar.vue'
import type { CreationTabId, AspectRatioValue, QualityValue, ResolutionValue, HistoryRecord, AiImageGeneratorCopy, ImageModelId, ImageModel } from './AIimage'


const { t } = useAppI18n()
const sidebarCollapsed = ref(false)
const activeTab = ref<CreationTabId>('my-creations')
const searchQuery = ref('')
const modelSearch = ref('')
const modelPickerOpen = ref(false)
const modelPickerRef = ref<HTMLElement | null>(null)
const isUploading = ref(false)
const isGenerating = ref(false)
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
const prompt = ref('')

const copy = computed(() => t('aiImageGenerator') as AiImageGeneratorCopy)
const tabs = computed<Array<{ id: CreationTabId; label: string }>>(() => [
	{ id: 'my-creations', label: copy.value.myCreations },
	{ id: 'templates', label: copy.value.templates },
	{ id: 'tutorials', label: copy.value.tutorials },
])
const imageModels: ImageModel[] = [
	{ id: 'gpt-image-2', name: 'GPT Image 2', desc: '', credits: '', icon: 'openai', platformCode: 2, textModelCode: 3, imageModelCode: 4 },
	{ id: 'nano-banana-pro', name: 'Nano Banana Pro', desc: '', credits: '', icon: 'google', platformCode: 1, textModelCode: 1, imageModelCode: 2 },
	{ id: 'nano-banana-2', name: 'Nano Banana 2', desc: '', credits: '', icon: 'google', platformCode: 1, textModelCode: 1, imageModelCode: 2 },
	{ id: 'nano-banana', name: 'Nano Banana', desc: '', credits: '', icon: 'google', platformCode: 1, textModelCode: 1, imageModelCode: 2 },
	{ id: 'seedream-4-5', name: 'Seedream 4.5', desc: '', credits: '', icon: 'seedream', platformCode: 1, textModelCode: 1, imageModelCode: 2 },
]
const modelIconClass = (icon: ImageModel['icon']) => [
	'grid h-9 w-9 place-items-center rounded-[10px] border border-white/10 text-lg font-black',
	icon === 'google'
		? 'bg-[#242426] text-[#4285f4]'
		: icon === 'seedream'
			? 'bg-gradient-to-br from-[#26262a] to-slate-800 text-cyan-200'
			: 'bg-[#242426] text-white/85',
]
const choiceButtonClass = (active: boolean, minHeight = 'min-h-[38px]') => [
	'grid min-w-0 place-items-center rounded-[9px] border px-2 text-[13px] font-[850] transition-colors',
	minHeight,
	active
		? 'border-white/20 bg-[#3a3a3d] text-white shadow-[inset_0_0_0_1px_rgba(255,255,255,0.08)]'
		: 'border-white/10 bg-[#1f1f21] text-white/60 hover:border-white/20 hover:bg-[#252527] hover:text-white/80',
]
const aspectRatios = computed<Array<{ label: string; value: AspectRatioValue }>>(() => [
	{ label: copy.value.autoRatio, value: 'auto' },
	{ label: '1:1', value: '1:1' },
	{ label: '1:2', value: '1:2' },
	{ label: '2:1', value: '2:1' },
	{ label: '2:3', value: '2:3' },
	{ label: '3:2', value: '3:2' },
	{ label: '4:3', value: '4:3' },
	{ label: '3:4', value: '3:4' },
	{ label: '4:5', value: '4:5' },
	{ label: '5:4', value: '5:4' },
	{ label: '16:9', value: '16:9' },
	{ label: '9:16', value: '9:16' },
	{ label: '21:9', value: '21:9' },
])
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
const resolutionOptions: Array<{ label: ResolutionValue; value: ResolutionValue; credits: number }> = [
	{ label: '1K', value: '1K', credits: 5 },
	{ label: '2K', value: '2K', credits: 8 },
	{ label: '4K', value: '4K', credits: 10 },
]
const imageCounts = [1, 2, 3, 4]
const selectedModel = computed(() => localizedImageModels.value.find(model => model.id === selectedModelId.value) ?? localizedImageModels.value[0])
const filteredModels = computed(() => {
	const query = modelSearch.value.toLowerCase()
	if (!query) return localizedImageModels.value
	return localizedImageModels.value.filter(model => `${model.name} ${model.desc}`.toLowerCase().includes(query))
})
const resolutionCredits = computed(() => resolutionOptions.find(option => option.value === selectedResolution.value)?.credits ?? 5)
const requiredCredits = computed(() => imageCount.value * resolutionCredits.value)

const records = ref<HistoryRecord[]>([])

const visibleRecords = computed(() => {
	const query = searchQuery.value.toLowerCase()
	if (!query) return records.value
	return records.value.filter(record => `${record.prompt} ${record.model} ${record.type}`.toLowerCase().includes(query))
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
const formatDateTime = (date: Date) => {
	const pad = (value: number) => String(value).padStart(2, '0')
	return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`
}
const formatRecordTime = (value?: string) => {
	if (!value) return copy.value.now
	const match = value.match(/^(\d{4})-(\d{2})-(\d{2})\s+(\d{2}):(\d{2})/)
	return match ? `${match[2]}/${match[3]} ${match[4]}:${match[5]}` : value
}
const getModelNameFromCodes = (platformCode?: number, modelCode?: number) => {
	if (platformCode === 2 && modelCode === 3) return 'GPT Image 2'
	if (platformCode === 2 && modelCode === 4) return 'GPT Image 2'
	if (platformCode === 1 && modelCode === 1) return 'Seedream 4.5'
	if (platformCode === 1 && modelCode === 2) return 'Seedream 4.5'
	return copy.value.fallbackModelName
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
})
const updateRecord = (id: string, patch: Partial<HistoryRecord>) => {
	records.value = records.value.map(record => record.id === id ? { ...record, ...patch } : record)
}
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
		const urls = files.length > 2
			? await uploadMultipleFiles(files)
			: await Promise.all(files.map(file => uploadSingleFile(file)))
		uploadedImageUrls.value = urls.filter(Boolean)
		return uploadedImageUrls.value
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
	uploadedPreviews.value.forEach(url => URL.revokeObjectURL(url))
	uploadedFiles.value = files
	uploadedPreviews.value = files.map(file => URL.createObjectURL(file))
	uploadedImageUrls.value = []
	uploadedCount.value = files.length
	input.value = ''
	if (files.length) {
		await uploadSelectedFiles(files)
	}
}
const removeUploadedImage = (index: number) => {
	const preview = uploadedPreviews.value[index]
	if (preview) URL.revokeObjectURL(preview)
	uploadedFiles.value = uploadedFiles.value.filter((_, fileIndex) => fileIndex !== index)
	uploadedPreviews.value = uploadedPreviews.value.filter((_, previewIndex) => previewIndex !== index)
	uploadedImageUrls.value = uploadedImageUrls.value.filter((_, urlIndex) => urlIndex !== index)
	uploadedCount.value = uploadedFiles.value.length
}

const selectModel = (id: ImageModelId) => {
	selectedModelId.value = id
	modelPickerOpen.value = false
	modelSearch.value = ''
}

const getGenerationCodes = (hasImages: boolean) => ({
	platformCode: selectedModel.value.platformCode,
	modelCode: hasImages ? selectedModel.value.imageModelCode : selectedModel.value.textModelCode,
})
const pollImageResult = async (traceId: string, recordId: string) => {
	const startedAt = Date.now()
	let progressTimer: ReturnType<typeof window.setInterval> | null = window.setInterval(() => {
		const elapsed = Date.now() - startedAt
		updateRecord(recordId, { progress: Math.min(96, Math.round((elapsed / 20000) * 96)) })
	}, 600)
	let result: AiImageResultItem | null = null

	try {
		for (let attempt = 0; attempt < 60; attempt++) {
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
const generateImage = async () => {
	if (isUploading.value || isGenerating.value) return
	isGenerating.value = true
	try {
		const imageUrls = uploadedFiles.value.length && !uploadedImageUrls.value.length
			? await uploadSelectedFiles()
			: uploadedImageUrls.value
		const hasImages = imageUrls.length > 0
		const codes = getGenerationCodes(hasImages)
		const response = await generateAiImageController({
			prompt: prompt.value,
			images: imageUrls,
			ratio: selectedAspectRatio.value === 'auto' ? '1:1' : selectedAspectRatio.value,
			resolution: selectedResolution.value.toLowerCase(),
			platformCode: codes.platformCode,
			modelCode: codes.modelCode,
			n: imageCount.value,
		})
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
			},
			...records.value,
		]
		await pollImageResult(traceId, recordId)
	} finally {
		isGenerating.value = false
	}
}
const loadHistory = async () => {
	const end = new Date()
	const start = new Date(end)
	start.setDate(start.getDate() - 30)
	const response = await getAiImageHistoryController({
		startTime: formatDateTime(start),
		endTime: formatDateTime(end),
	})
	const history = (response.rows ?? []).map(mapResultToRecord)
	records.value = history
}

const handleDocumentPointerDown = (event: PointerEvent) => {
	if (!modelPickerRef.value?.contains(event.target as Node)) {
		modelPickerOpen.value = false
	}
}

onMounted(() => {
	document.addEventListener('pointerdown', handleDocumentPointerDown)
	loadHistory().catch(() => {})
})

onBeforeUnmount(() => {
	document.removeEventListener('pointerdown', handleDocumentPointerDown)
	uploadedPreviews.value.forEach(url => URL.revokeObjectURL(url))
})
</script>
