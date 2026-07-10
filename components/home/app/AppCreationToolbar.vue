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
				<div v-if="openFilter === 'time' && timeOptions.length" class="app-creation-toolbar-menu app-creation-toolbar-menu--time">
					<div class="app-creation-toolbar-menu__dates">
						<button
							type="button"
							class="app-creation-toolbar-date-field"
							:class="{ 'is-active': openDateField === 'start' }"
							@click.stop="toggleDateField('start')"
						>
							<span class="sr-only">{{ startDateLabel }}</span>
							<span>{{ startDate || startDateLabel }}</span>
							<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
								<rect x="4" y="5" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.5" />
								<path d="M7 3.5V6.5M13 3.5V6.5M4.5 8.5H15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</button>
						<span aria-hidden="true">-</span>
						<button
							type="button"
							class="app-creation-toolbar-date-field"
							:class="{ 'is-active': openDateField === 'end' }"
							@click.stop="toggleDateField('end')"
						>
							<span class="sr-only">{{ endDateLabel }}</span>
							<span>{{ endDate || endDateLabel }}</span>
							<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
								<rect x="4" y="5" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.5" />
								<path d="M7 3.5V6.5M13 3.5V6.5M4.5 8.5H15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
							</svg>
						</button>
					</div>
					<button
						v-if="dateClearable"
						type="button"
						class="app-creation-toolbar-menu__clear"
						:disabled="!hasDateValue && selectedTime !== 'custom'"
						@click="clearDates"
					>
						{{ clearDateLabel }}
					</button>

					<div v-if="openDateField" class="app-creation-toolbar-calendar">
						<div class="app-creation-toolbar-calendar__header">
							<button type="button" :aria-label="previousMonthLabel" @click.stop="changeCalendarMonth(-1)">
								<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
									<path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</button>
							<strong>{{ calendarMonthLabel }}</strong>
							<button type="button" :aria-label="nextMonthLabel" @click.stop="changeCalendarMonth(1)">
								<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
									<path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</button>
						</div>
						<div class="app-creation-toolbar-calendar__weekdays">
							<span v-for="day in calendarWeekdays" :key="day">{{ day }}</span>
						</div>
						<div class="app-creation-toolbar-calendar__grid">
							<button
								v-for="day in calendarDays"
								:key="day.key"
								type="button"
								:class="{
									'is-muted': !day.isCurrentMonth,
									'is-selected': day.isSelected,
								}"
								@click.stop="selectCalendarDate(day.date)"
							>
								{{ day.label }}
							</button>
						</div>
					</div>

					<template v-if="!openDateField">
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
					</template>
				</div>
			</div>

			<div class="app-creation-toolbar-filter">
				<button type="button" :aria-expanded="openFilter === 'type'" @click="toggleFilter('type')">
					{{ typeLabel }}
					<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
						<path d="M5.5 8L10 12.5L14.5 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
					</svg>
				</button>
				<div v-if="openFilter === 'type' && typeOptions.length" class="app-creation-toolbar-menu app-creation-toolbar-menu--type">
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

type DateField = 'start' | 'end'

type CalendarDay = {
	key: string
	date: Date
	label: number
	isCurrentMonth: boolean
	isSelected: boolean
}

const props = withDefaults(defineProps<{
	timeLabel: string
	typeLabel: string
	search: string
	searchPlaceholder: string
	searchLabel: string
	selectLabel: string
	startDate?: string
	endDate?: string
	startDateLabel?: string
	endDateLabel?: string
	clearDateLabel?: string
	previousMonthLabel?: string
	nextMonthLabel?: string
	dateClearable?: boolean
	selectedTime?: string
	selectedType?: string
	timeOptions?: ToolbarOption[]
	typeOptions?: ToolbarOption[]
}>(), {
	startDate: '',
	endDate: '',
	startDateLabel: 'Start Date',
	endDateLabel: 'End Date',
	clearDateLabel: 'Clear',
	previousMonthLabel: 'Previous month',
	nextMonthLabel: 'Next month',
	dateClearable: false,
	selectedTime: 'all',
	selectedType: 'all',
	timeOptions: () => [],
	typeOptions: () => [],
})

const emit = defineEmits<{
	'update:search': [value: string]
	'update:startDate': [value: string]
	'update:endDate': [value: string]
	'update:selectedTime': [value: string]
	'update:selectedType': [value: string]
}>()

const { locale } = useAppI18n()
const openFilter = ref<'time' | 'type' | null>(null)
const openDateField = ref<DateField | null>(null)
const filtersRef = ref<HTMLElement | null>(null)
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
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const addMonths = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1)
const calendarMonth = ref(startOfMonth(parseAssetDate(props.endDate) ?? new Date()))
const calendarLocale = computed(() => locale.value === 'zh' ? 'zh-CN' : locale.value === 'ja' ? 'ja-JP' : locale.value === 'de' ? 'de-DE' : locale.value === 'es' ? 'es-ES' : 'en-US')
const calendarWeekdays = computed(() => {
	const baseDate = new Date(2026, 5, 21)
	return Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(calendarLocale.value, { weekday: 'short' }).format(new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + index)))
})
const calendarMonthLabel = computed(() => new Intl.DateTimeFormat(calendarLocale.value, { month: 'long', year: 'numeric' }).format(calendarMonth.value))
const selectedCalendarDate = computed(() => parseAssetDate(openDateField.value === 'start' ? props.startDate : props.endDate))
const hasDateValue = computed(() => Boolean(props.startDate || props.endDate))
const calendarDays = computed<CalendarDay[]>(() => {
	const monthStart = startOfMonth(calendarMonth.value)
	const gridStart = new Date(monthStart)
	gridStart.setDate(monthStart.getDate() - gridStart.getDay())
	const selected = selectedCalendarDate.value

	return Array.from({ length: 42 }, (_, index) => {
		const date = new Date(gridStart)
		date.setDate(gridStart.getDate() + index)
		return {
			key: formatAssetDate(date),
			date,
			label: date.getDate(),
			isCurrentMonth: date.getMonth() === monthStart.getMonth(),
			isSelected: !!selected && date.toDateString() === selected.toDateString(),
		}
	})
})

const toggleFilter = (filter: 'time' | 'type') => {
	const hasOptions = filter === 'time' ? props.timeOptions.length : props.typeOptions.length
	if (!hasOptions) return
	openFilter.value = openFilter.value === filter ? null : filter
	if (filter !== 'time') openDateField.value = null
}

const selectTime = (value: string) => {
	emit('update:selectedTime', value)
	openFilter.value = null
	openDateField.value = null
}

const selectType = (value: string) => {
	emit('update:selectedType', value)
	openFilter.value = null
}

const toggleDateField = (field: DateField) => {
	openDateField.value = openDateField.value === field ? null : field
	const selectedDate = parseAssetDate(field === 'start' ? props.startDate : props.endDate)
	if (selectedDate) calendarMonth.value = startOfMonth(selectedDate)
	emit('update:selectedTime', 'custom')
}

const changeCalendarMonth = (amount: number) => {
	calendarMonth.value = addMonths(calendarMonth.value, amount)
}

const selectCalendarDate = (date: Date) => {
	if (openDateField.value === 'start') emit('update:startDate', formatAssetDate(date))
	if (openDateField.value === 'end') emit('update:endDate', formatAssetDate(date))
	emit('update:selectedTime', 'custom')
}

const clearDates = () => {
	emit('update:startDate', '')
	emit('update:endDate', '')
	emit('update:selectedTime', 'all')
	openDateField.value = null
}

const handleDocumentPointerDown = (event: PointerEvent) => {
	if (!filtersRef.value?.contains(event.target as Node)) {
		openFilter.value = null
		openDateField.value = null
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
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 10px;
	background: #151515;
	box-shadow: 0 18px 60px rgba(0, 0, 0, 0.46);
}

.app-creation-toolbar-menu--time {
	width: min(380px, calc(100vw - 32px));
	padding: 12px 14px 14px;
	overflow: visible;
}

.app-creation-toolbar-menu--type {
	width: 180px;
	background: #080808;
	padding: 6px;
}

.app-creation-toolbar-menu__dates {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
	align-items: center;
	gap: 8px;
	color: rgba(255, 255, 255, 0.34);
	font-size: 13px;
}

.app-creation-toolbar-menu__dates + .app-creation-toolbar-menu__option {
	margin-top: 12px;
}

.app-creation-toolbar-menu__clear {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	min-height: 30px;
	margin-top: 10px;
	border: 0;
	border-radius: 7px;
	background: rgba(255, 255, 255, 0.06);
	padding: 0 12px;
	color: rgba(255, 255, 255, 0.58);
	font: inherit;
	font-size: 12px;
	font-weight: 700;
	cursor: pointer;
	transition: background 160ms ease, color 160ms ease;

	&:hover:not(:disabled) {
		background: rgba(255, 255, 255, 0.1);
		color: rgba(255, 255, 255, 0.9);
	}

	&:disabled {
		cursor: not-allowed;
		opacity: 0.42;
	}
}

.app-creation-toolbar-date-field {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 6px;
	height: 38px;
	min-width: 0;
	border: 1px solid rgba(255, 255, 255, 0.09);
	border-radius: 8px;
	background: #1b1b1b;
	padding: 0 10px;
	color: rgba(255, 255, 255, 0.72);
	font: inherit;
	font-size: 13px;
	cursor: pointer;

	> span:not(.sr-only) {
		min-width: 0;
		overflow: hidden;
		text-overflow: ellipsis;
		white-space: nowrap;
	}

	svg {
		flex: 0 0 auto;
		width: 16px;
		height: 16px;
		color: rgba(255, 255, 255, 0.48);
	}

	&.is-active {
		border-color: rgba(255, 255, 255, 0.16);
		background: rgba(255, 255, 255, 0.08);
		color: rgba(255, 255, 255, 0.9);
	}
}

.app-creation-toolbar-calendar {
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	z-index: 24;
	width: min(360px, calc(100vw - 32px));
	box-sizing: border-box;
	border: 1px solid rgba(255, 255, 255, 0.13);
	border-radius: 12px;
	background: #050505;
	box-shadow: 0 22px 64px rgba(0, 0, 0, 0.58);
	padding: 22px 24px 24px;
}

.app-creation-toolbar-calendar__header {
	display: grid;
	grid-template-columns: 32px minmax(0, 1fr) 32px;
	align-items: center;
	gap: 8px;
	margin-bottom: 22px;

	button {
		display: grid;
		place-items: center;
		width: 32px;
		height: 32px;
		border: 0;
		border-radius: 8px;
		background: transparent;
		color: rgba(255, 255, 255, 0.82);
		cursor: pointer;
	}

	button:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	svg {
		width: 20px;
		height: 20px;
	}

	strong {
		overflow: hidden;
		color: rgba(255, 255, 255, 0.92);
		font-size: 18px;
		font-weight: 760;
		line-height: 1.2;
		text-align: center;
		text-overflow: ellipsis;
		white-space: nowrap;
	}
}

.app-creation-toolbar-calendar__weekdays,
.app-creation-toolbar-calendar__grid {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	column-gap: 10px;
	row-gap: 10px;
}

.app-creation-toolbar-calendar__weekdays {
	margin-bottom: 10px;

	span {
		color: rgba(255, 255, 255, 0.5);
		font-size: 15px;
		font-weight: 650;
		line-height: 30px;
		text-align: center;
	}
}

.app-creation-toolbar-calendar__grid button {
	display: grid;
	place-items: center;
	height: 34px;
	border: 0;
	border-radius: 10px;
	background: transparent;
	color: rgba(255, 255, 255, 0.84);
	font: inherit;
	font-size: 16px;
	font-weight: 650;
	cursor: pointer;

	&:hover {
		background: rgba(255, 255, 255, 0.08);
	}

	&.is-muted {
		color: rgba(255, 255, 255, 0.24);
	}

	&.is-selected {
		background: rgba(255, 255, 255, 0.16);
		color: #fff;
	}
}

.app-creation-toolbar-menu__option {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 12px;
	width: 100%;
	height: 38px;
	border: 0;
	border-radius: 7px;
	background: transparent;
	padding: 0 12px;
	color: rgba(255, 255, 255, 0.62);
	font: inherit;
	font-size: 14px;
	font-weight: 500;
	text-align: left;
	cursor: pointer;
	transition: background 160ms ease, color 160ms ease;

	&:hover,
	&.is-active {
		background: rgba(255, 255, 255, 0.1);
		color: #fff;
	}

	svg {
		flex: 0 0 auto;
		width: 16px;
		height: 16px;
		color: rgba(255, 255, 255, 0.82);
	}
}

.app-creation-toolbar-menu--time .app-creation-toolbar-menu__option {
	background: transparent;
}

.app-creation-toolbar-menu--time .app-creation-toolbar-menu__option:hover {
	background: rgba(255, 255, 255, 0.04);
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

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
}
</style>
