<template>
	<div class="grid gap-4">
		<div class="flex flex-wrap gap-2" role="tablist" :aria-label="categoriesLabel">
			<button
				v-for="tab in tabs"
				:key="tab.id"
				type="button"
				:class="[
					'min-h-[34px] rounded-full border px-3.5 text-[12.5px] font-[850] transition-colors',
					activeCategory === tab.id
						? 'border-white bg-white text-[#151515]'
						: 'border-white/10 bg-[#171719] text-white/55 hover:border-white/20 hover:text-white/75',
				]"
				role="tab"
				:aria-selected="activeCategory === tab.id"
				@click="activeCategory = tab.id"
			>
				{{ tab.label }}
			</button>
		</div>

		<div class="grid grid-cols-2 gap-3 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
			<button
				v-for="card in activeCards"
				:key="card.id"
				type="button"
				class="group grid gap-2 text-left"
				@click="emit('select', { card, category: activeCategory })"
			>
				<div class="relative aspect-[3/4] overflow-hidden rounded-xl border border-white/10 bg-[#141414] transition-[border-color,box-shadow] duration-300 group-hover:border-white/20 group-hover:shadow-[0_18px_48px_rgba(0,0,0,0.42)]">
					<NuxtImg
						class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.04]"
						:src="card.image"
						:alt="card.alt"
						loading="lazy"
					/>
					<span class="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/50" />
					<span class="pointer-events-none absolute inset-0 grid place-items-center opacity-0 transition-opacity duration-300 group-hover:opacity-100">
						<span class="inline-flex h-10 items-center gap-2 rounded-full bg-white px-4 text-[12.5px] font-[850] text-[#151515] shadow-[0_10px_30px_rgba(0,0,0,0.28)]">
							<svg class="h-4 w-4 shrink-0" viewBox="0 0 20 20" fill="none" aria-hidden="true">
								<path d="M10.5 3.5L11.8 7.8L16 9L11.8 10.2L10.5 14.5L9.2 10.2L5 9L9.2 7.8L10.5 3.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
								<path d="M4.5 13.5L5.2 15.2L7 16L5.2 16.8L4.5 18.5L3.8 16.8L2 16L3.8 15.2L4.5 13.5Z" stroke="currentColor" stroke-width="1.3" stroke-linejoin="round" />
							</svg>
							{{ useActionLabel }}
						</span>
					</span>
				</div>
				<span class="line-clamp-2 text-[11.5px] font-semibold leading-snug text-white/40 transition-colors group-hover:text-white/65">
					{{ card.title }}
				</span>
			</button>
		</div>
	</div>
</template>

<script setup lang="ts">
import type { TemplateCard, TemplateTabId } from '~/utils/promptTemplates'

defineProps<{
	categoriesLabel?: string
}>()

const emit = defineEmits<{
	select: [payload: { card: TemplateCard; category: TemplateTabId }]
}>()

const { t } = useAppI18n()
const { activeCategory, tabs, activeCards } = usePromptTemplates()
const useActionLabel = computed(() => t('home.promptTemplates.useAction'))
</script>
