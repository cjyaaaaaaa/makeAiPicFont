<template>
	<div class="app-creation-toolbar">
		<div ref="filtersRef" class="app-creation-toolbar__filters">
			<div class="app-creation-toolbar-filter">
				<button type="button" :aria-expanded="openFilter === 'time'" @click="toggleFilter('time')">
					{{ timeLabel }}
					<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
						<path d="M5.5 8L10 12.5L14.5 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
				<div v-if="openFilter === 'time' && timeOptions.length" class="app-creation-toolbar-menu">
					<button
						v-for="option in timeOptions"
						:key="option.value"
						type="button"
						class="app-creation-toolbar-menu__option"
						:class="{ 'is-active': option.value === selectedTime }"
						@click="selectTime(option.value)"
					>
						{{ option.label }}
						<svg v-if="option.value === selectedTime" viewBox="0 0 20 20" fill="none" aria-hidden="true">
							<path d="M4 10.5L8 14.5L16 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
				</div>
			</div>

			<div class="app-creation-toolbar-filter">
				<button type="button" :aria-expanded="openFilter === 'type'" @click="toggleFilter('type')">
					{{ typeLabel }}
					<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
						<path d="M5.5 8L10 12.5L14.5 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
				<div v-if="openFilter === 'type' && typeOptions.length" class="app-creation-toolbar-menu">
					<button
						v-for="option in typeOptions"
						:key="option.value"
						type="button"
						class="app-creation-toolbar-menu__option"
						:class="{ 'is-active': option.value === selectedType }"
						@click="selectType(option.value)"
					>
						{{ option.label }}
						<svg v-if="option.value === selectedType" viewBox="0 0 20 20" fill="none" aria-hidden="true">
							<path d="M4 10.5L8 14.5L16 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
						</svg>
					</button>
				</div>
			</div>
		</div>

		<label class="app-creation-toolbar__search">
			<span class="sr-only">{{ searchLabel }}</span>
			<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5" />
				<path d="M13.2 13.2L16.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
			</svg>
			<input :value="search" type="search" :placeholder="searchPlaceholder" @input="emit('update:search', ($event.target as HTMLInputElement).value)" />
		</label>

		<button type="button" class="app-creation-toolbar__select" :aria-label="selectLabel">
			<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
				<rect x="3.5" y="3.5" width="13" height="13" rx="2" stroke="currentColor" stroke-width="1.4" />
				<path d="M7 10L9.2 12.2L13.5 7.5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" />
			</svg>
		</button>
	</div>
</template>

<script setup lang="ts">
type ToolbarOption = {
	label: string
	value: string
}

const props = withDefaults(defineProps<{
	timeLabel: string
	typeLabel: string
	search: string
	searchPlaceholder: string
	searchLabel: string
	selectLabel: string
	selectedTime?: string
	selectedType?: string
	timeOptions?: ToolbarOption[]
	typeOptions?: ToolbarOption[]
}>(), {
	selectedTime: 'all',
	selectedType: 'all',
	timeOptions: () => [],
	typeOptions: () => [],
})

const emit = defineEmits<{
	'update:search': [value: string]
	'update:selectedTime': [value: string]
	'update:selectedType': [value: string]
}>()

const openFilter = ref<'time' | 'type' | null>(null)
const filtersRef = ref<HTMLElement | null>(null)

const toggleFilter = (filter: 'time' | 'type') => {
	const hasOptions = filter === 'time' ? props.timeOptions.length : props.typeOptions.length
	if (!hasOptions) return
	openFilter.value = openFilter.value === filter ? null : filter
}

const selectTime = (value: string) => {
	emit('update:selectedTime', value)
	openFilter.value = null
}

const selectType = (value: string) => {
	emit('update:selectedType', value)
	openFilter.value = null
}

const handleDocumentPointerDown = (event: PointerEvent) => {
	if (!filtersRef.value?.contains(event.target as Node)) {
		openFilter.value = null
	}
}

onMounted(() => {
	document.addEventListener('pointerdown', handleDocumentPointerDown)
})

onBeforeUnmount(() => {
	document.removeEventListener('pointerdown', handleDocumentPointerDown)
})
</script>

<style scoped lang="scss">
.app-creation-toolbar {
	display: grid;
	grid-template-columns: auto minmax(180px, 1fr) 36px;
	gap: 9px;
	margin-bottom: 22px;
}

.app-creation-toolbar__filters {
	display: inline-flex;
	position: relative;
	overflow: visible;
	border: 1px solid rgba(255, 255, 255, 0.11);
	border-radius: 9px;
	background: #0b0b0c;

	.app-creation-toolbar-filter + .app-creation-toolbar-filter {
		border-left: 1px solid rgba(255, 255, 255, 0.08);
	}
}

.app-creation-toolbar-filter {
	position: relative;

	> button {
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		height: 36px;
		min-width: 120px;
		border: 0;
		background: transparent;
		padding: 0 14px;
		color: rgba(255, 255, 255, 0.86);
		font: inherit;
		font-size: 12px;
		font-weight: 800;
		letter-spacing: 0;
		cursor: pointer;
	}

	> button svg {
		width: 14px;
		height: 14px;
		color: rgba(255, 255, 255, 0.38);
		transition: transform 160ms ease, color 160ms ease;
	}

	> button[aria-expanded="true"] svg {
		color: rgba(255, 255, 255, 0.72);
		transform: rotate(180deg);
	}
}

.app-creation-toolbar-menu {
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	z-index: 20;
	width: 180px;
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 10px;
	background: #080808;
	box-shadow: 0 18px 60px rgba(0, 0, 0, 0.46);
	padding: 6px;
}

.app-creation-toolbar-menu__option {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 10px;
	width: 100%;
	min-height: 34px;
	border: 0;
	border-radius: 8px;
	background: transparent;
	padding: 0 10px;
	color: rgba(255, 255, 255, 0.62);
	font: inherit;
	font-size: 12px;
	font-weight: 700;
	cursor: pointer;

	&:hover,
	&.is-active {
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.9);
	}

	svg {
		width: 14px;
		height: 14px;
		color: rgba(255, 255, 255, 0.72);
	}
}

.app-creation-toolbar__search {
	display: flex;
	align-items: center;
	gap: 8px;
	min-width: 0;
	height: 36px;
	border: 1px solid rgba(255, 255, 255, 0.11);
	border-radius: 9px;
	background: #0b0b0c;
	padding: 0 12px;
	color: rgba(255, 255, 255, 0.32);

	svg {
		flex: 0 0 auto;
		width: 16px;
		height: 16px;
	}

	input {
		min-width: 0;
		width: 100%;
		border: 0;
		background: transparent;
		color: rgba(255, 255, 255, 0.82);
		font: inherit;
		font-size: 12px;
		outline: none;
	}

	input::placeholder {
		color: rgba(255, 255, 255, 0.34);
	}
}

.app-creation-toolbar__select {
	display: grid;
	place-items: center;
	width: 36px;
	height: 36px;
	border: 1px solid rgba(255, 255, 255, 0.11);
	border-radius: 10px;
	background: #111113;
	color: rgba(255, 255, 255, 0.38);
	cursor: pointer;

	svg {
		width: 17px;
		height: 17px;
	}
}

@media (max-width: 1120px) {
	.app-creation-toolbar {
		grid-template-columns: 1fr 36px;
	}

	.app-creation-toolbar__filters {
		grid-column: 1 / -1;
		width: fit-content;
	}
}
</style>
