<template>
	<div class="app-assets" :class="{ 'is-sidebar-collapsed': sidebarCollapsed }">
		<AppHomeSidebar :collapsed="sidebarCollapsed" @toggle-collapse="sidebarCollapsed = !sidebarCollapsed" />
		<main class="app-assets__main">
			<section class="app-assets__panel" :aria-label="copy.title">
				<div class="app-assets__top">
					<h1>{{ copy.title }}</h1>
					<button type="button" class="app-assets__create" @click="navigateToCreate">
						<span aria-hidden="true">+</span>
						{{ copy.startCreating }}
					</button>
				</div>

				<div class="app-assets__toolbar">
					<div ref="filtersRef" class="app-assets__filters">
						<div class="app-assets-filter">
							<button type="button" :aria-expanded="openFilter === 'time'" @click="toggleFilter('time')">
								{{ selectedTimeLabel }}
								<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
									<path d="M5.5 8L10 12.5L14.5 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</button>
							<div v-if="openFilter === 'time'" class="app-assets-menu app-assets-menu--time">
								<div class="app-assets-menu__dates">
									<button
										type="button"
										class="app-assets-date-field"
										:class="{ 'is-active': openDateField === 'start' }"
										@click.stop="toggleDateField('start')"
									>
										<span class="sr-only">{{ copy.startDate }}</span>
										<span>{{ startDate || copy.startDate }}</span>
										<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
											<rect x="4" y="5" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.5" />
											<path d="M7 3.5V6.5M13 3.5V6.5M4.5 8.5H15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
										</svg>
									</button>
									<span aria-hidden="true">-</span>
									<button
										type="button"
										class="app-assets-date-field"
										:class="{ 'is-active': openDateField === 'end' }"
										@click.stop="toggleDateField('end')"
									>
										<span class="sr-only">{{ copy.endDate }}</span>
										<span>{{ endDate || copy.endDate }}</span>
										<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
											<rect x="4" y="5" width="12" height="11" rx="2" stroke="currentColor" stroke-width="1.5" />
											<path d="M7 3.5V6.5M13 3.5V6.5M4.5 8.5H15.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
										</svg>
									</button>
								</div>
								<div v-if="openDateField" class="app-assets-calendar">
									<div class="app-assets-calendar__header">
										<button type="button" :aria-label="copy.previousMonth || 'Previous month'" @click.stop="changeCalendarMonth(-1)">
											<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
												<path d="M12.5 5L7.5 10L12.5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
											</svg>
										</button>
										<strong>{{ calendarMonthLabel }}</strong>
										<button type="button" :aria-label="copy.nextMonth || 'Next month'" @click.stop="changeCalendarMonth(1)">
											<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
												<path d="M7.5 5L12.5 10L7.5 15" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
											</svg>
										</button>
									</div>
									<div class="app-assets-calendar__weekdays">
										<span v-for="day in calendarWeekdays" :key="day">{{ day }}</span>
									</div>
									<div class="app-assets-calendar__grid">
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
										v-for="option in copy.timeFilters"
										:key="option.value"
										type="button"
										class="app-assets-menu__option"
										:class="{ 'is-active': timeFilter === option.value }"
										@click="selectTimeFilter(option.value)"
									>
										{{ option.label }}
										<svg v-if="timeFilter === option.value" viewBox="0 0 20 20" fill="none" aria-hidden="true">
											<path d="M4 10.5L8 14.5L16 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
										</svg>
									</button>
								</template>
							</div>
						</div>

						<div class="app-assets-filter">
							<button type="button" :aria-expanded="openFilter === 'type'" @click="toggleFilter('type')">
								{{ selectedTypeLabel }}
								<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
									<path d="M5.5 8L10 12.5L14.5 8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
								</svg>
							</button>
							<div v-if="openFilter === 'type'" class="app-assets-menu app-assets-menu--type">
								<button
									v-for="option in copy.typeFilters"
									:key="option.value"
									type="button"
									class="app-assets-menu__option"
									:class="{ 'is-active': typeFilter === option.value }"
									@click="selectTypeFilter(option.value)"
								>
									{{ option.label }}
									<svg v-if="typeFilter === option.value" viewBox="0 0 20 20" fill="none" aria-hidden="true">
										<path d="M4 10.5L8 14.5L16 6" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
								</button>
							</div>
						</div>
					</div>

					<label class="app-assets__search">
						<span class="sr-only">{{ copy.searchLabel }}</span>
						<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
							<circle cx="9" cy="9" r="5.5" stroke="currentColor" stroke-width="1.5" />
							<path d="M13.2 13.2L16.5 16.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
						</svg>
						<input v-model.trim="searchQuery" type="search" :placeholder="copy.searchPlaceholder" />
					</label>
				</div>

				<div class="app-assets__list">
					<article v-for="record in visibleRecords" :key="record.id" class="app-assets-record">
						<header>
							<div class="app-assets-record__meta">
								<strong>{{ record.model }}</strong>
								<span>{{ record.typeLabel }}</span>
								<time>{{ record.time }}</time>
							</div>
							<button v-if="record.status === 'success'" type="button" class="app-assets-record__open" :aria-label="copy.openAsset">
								<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
									<path d="M5.5 4.5H10L11.4 6H15A1.5 1.5 0 0 1 16.5 7.5V14A1.5 1.5 0 0 1 15 15.5H5A1.5 1.5 0 0 1 3.5 14V6A1.5 1.5 0 0 1 5 4.5Z" stroke="currentColor" stroke-width="1.5" stroke-linejoin="round" />
								</svg>
							</button>
						</header>

						<p class="app-assets-record__prompt">{{ record.prompt }}</p>

						<div v-if="record.status === 'failed'" class="app-assets-record__failure">
							<strong>
								<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
									<circle cx="10" cy="10" r="7" stroke="currentColor" stroke-width="1.6" />
									<path d="M10 5.8V10.5M10 14.2H10.01" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" />
								</svg>
								{{ copy.failedTitle }}
							</strong>
							<p>{{ copy.failedMessage }}</p>
							<small>{{ copy.refundedMessage }}</small>
							<div class="app-assets-record__actions">
								<button type="button" @click="retryRecord(record.id)">
									<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
										<path d="M15.5 9.5A5.5 5.5 0 1 1 14 5.7" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
										<path d="M14.4 3.2V6.3H11.3" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
									</svg>
									{{ copy.retry }}
								</button>
								<button type="button" class="is-danger" :aria-label="copy.delete" @click="deleteRecord(record.id)">
									<svg viewBox="0 0 20 20" fill="none" aria-hidden="true">
										<path d="M7.5 4.5H12.5M4.5 6.5H15.5M6 6.5L6.6 15A1.5 1.5 0 0 0 8.1 16.4H11.9A1.5 1.5 0 0 0 13.4 15L14 6.5M8.6 9V14M11.4 9V14" stroke="currentColor" stroke-width="1.45" stroke-linecap="round" />
									</svg>
								</button>
							</div>
						</div>

						<div v-else-if="record.image" class="app-assets-record__image">
							<NuxtImg :src="record.image" :alt="record.prompt" />
						</div>
					</article>

					<div v-if="!visibleRecords.length" class="app-assets__empty">
						{{ copy.emptyState }}
					</div>
				</div>
			</section>
		</main>
	</div>
</template>

<script setup lang="ts">
import AppHomeSidebar from '~/components/home/app/AppHomeSidebar.vue'

type FilterOption = {
	label: string
	value: string
}

type AssetRecord = {
	id: string
	model: string
	type: 'image' | 'video'
	typeLabel: string
	time: string
	timeGroup: 'all' | 'today' | 'week'
	status: 'failed' | 'success'
	prompt: string
	imageKey?: string
}

type DateField = 'start' | 'end'

type CalendarDay = {
	key: string
	date: Date
	label: number
	isCurrentMonth: boolean
	isSelected: boolean
}

type AssetsCopy = {
	title: string
	startCreating: string
	searchPlaceholder: string
	searchLabel: string
	timeFilterLabel: string
	typeFilterLabel: string
	failedTitle: string
	failedMessage: string
	refundedMessage: string
	retry: string
	delete: string
	openAsset: string
	emptyState: string
	startDate: string
	endDate: string
	previousMonth?: string
	nextMonth?: string
	timeFilters: FilterOption[]
	typeFilters: FilterOption[]
	records: AssetRecord[]
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

const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1)
const addMonths = (date: Date, amount: number) => new Date(date.getFullYear(), date.getMonth() + amount, 1)

const { t, locale } = useAppI18n()
const sidebarCollapsed = ref(false)
const timeFilter = ref('all')
const typeFilter = ref('all')
const searchQuery = ref('')
const deletedIds = ref<string[]>([])
const retriedIds = ref<string[]>([])
const openFilter = ref<'time' | 'type' | null>(null)
const openDateField = ref<DateField | null>(null)
const filtersRef = ref<HTMLElement | null>(null)
const startDate = ref('')
const endDate = ref('26-06-27')
const calendarMonth = ref(startOfMonth(parseAssetDate(endDate.value) ?? new Date()))

const copy = computed(() => t('assets') as AssetsCopy)
const customTimeLabel = computed(() => locale.value === 'zh' ? '自定义' : 'Custom')
const selectedTimeLabel = computed(() => copy.value.timeFilters.find(option => option.value === timeFilter.value)?.label ?? (timeFilter.value === 'custom' ? customTimeLabel.value : copy.value.timeFilters[0]?.label ?? ''))
const selectedTypeLabel = computed(() => copy.value.typeFilters.find(option => option.value === typeFilter.value)?.label ?? copy.value.typeFilters[0]?.label ?? '')
const calendarLocale = computed(() => locale.value === 'zh' ? 'zh-CN' : locale.value === 'ja' ? 'ja-JP' : locale.value === 'de' ? 'de-DE' : locale.value === 'es' ? 'es-ES' : 'en-US')
const calendarWeekdays = computed(() => {
	const baseDate = new Date(2026, 5, 21)
	return Array.from({ length: 7 }, (_, index) => new Intl.DateTimeFormat(calendarLocale.value, { weekday: 'short' }).format(new Date(baseDate.getFullYear(), baseDate.getMonth(), baseDate.getDate() + index)))
})
const calendarMonthLabel = computed(() => new Intl.DateTimeFormat(calendarLocale.value, { month: 'long', year: 'numeric' }).format(calendarMonth.value))
const selectedCalendarDate = computed(() => parseAssetDate(openDateField.value === 'start' ? startDate.value : endDate.value))
const calendarDays = computed<CalendarDay[]>(() => {
	const monthStart = startOfMonth(calendarMonth.value)
	const gridStart = new Date(monthStart)
	gridStart.setDate(monthStart.getDate() - monthStart.getDay())
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
const photo = (id: string, width = 700) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=84`
const imageMap: Record<string, string> = {
	reading: photo('photo-1517841905240-472988babdf9', 700),
	portrait: photo('photo-1529139574466-a303027c1d8b', 700),
	interior: photo('photo-1600585154340-be6161a56a0c', 700),
}

const records = computed(() => copy.value.records.map(record => ({
	...record,
	status: retriedIds.value.includes(record.id) ? 'success' as const : record.status,
	image: record.imageKey ? imageMap[record.imageKey] : '',
})))

const visibleRecords = computed(() => {
	const query = searchQuery.value.toLowerCase()
	const rangeStart = timeFilter.value === 'custom' ? parseAssetDate(startDate.value) : null
	const rangeEnd = timeFilter.value === 'custom' ? parseAssetDate(endDate.value) : null
	const fallbackYear = rangeStart?.getFullYear() ?? rangeEnd?.getFullYear() ?? new Date().getFullYear()

	return records.value.filter((record) => {
		if (deletedIds.value.includes(record.id)) return false
		if (timeFilter.value === 'custom') {
			const recordDate = parseRecordDate(record.time, fallbackYear)
			if (recordDate && rangeStart && recordDate < rangeStart) return false
			if (recordDate && rangeEnd && recordDate > rangeEnd) return false
		} else if (timeFilter.value !== 'all' && record.timeGroup !== timeFilter.value) {
			return false
		}
		if (typeFilter.value !== 'all' && record.type !== typeFilter.value) return false
		if (query && !`${record.prompt} ${record.model} ${record.typeLabel}`.toLowerCase().includes(query)) return false
		return true
	})
})

const createPath = computed(() => locale.value === 'en' ? '/home' : `/${locale.value}/home`)

const navigateToCreate = async () => {
	await navigateTo(createPath.value)
}

const toggleFilter = (filter: 'time' | 'type') => {
	openFilter.value = openFilter.value === filter ? null : filter
	if (filter !== 'time') openDateField.value = null
}

const selectTimeFilter = (value: string) => {
	timeFilter.value = value
	openFilter.value = null
	openDateField.value = null
}

const selectTypeFilter = (value: string) => {
	typeFilter.value = value
	openFilter.value = null
	openDateField.value = null
}

const toggleDateField = (field: DateField) => {
	openDateField.value = openDateField.value === field ? null : field
	const selectedDate = parseAssetDate(field === 'start' ? startDate.value : endDate.value)
	if (selectedDate) calendarMonth.value = startOfMonth(selectedDate)
	timeFilter.value = 'custom'
}

const changeCalendarMonth = (amount: number) => {
	calendarMonth.value = addMonths(calendarMonth.value, amount)
}

const selectCalendarDate = (date: Date) => {
	if (openDateField.value === 'start') startDate.value = formatAssetDate(date)
	if (openDateField.value === 'end') endDate.value = formatAssetDate(date)
	timeFilter.value = 'custom'
}

const retryRecord = (id: string) => {
	if (!retriedIds.value.includes(id)) retriedIds.value = [...retriedIds.value, id]
}

const deleteRecord = (id: string) => {
	deletedIds.value = [...deletedIds.value, id]
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
.app-assets {
	display: grid;
	grid-template-columns: 288px minmax(0, 1fr);
	min-height: 100vh;
	background: #000;
	color: #f5f5f5;
	transition: grid-template-columns 220ms ease;
}

.app-assets.is-sidebar-collapsed {
	grid-template-columns: 84px minmax(0, 1fr);
}

.app-assets__main {
	min-width: 0;
	padding: 58px 44px;
}

.app-assets__panel {
	width: min(1380px, 100%);
	margin: 0 auto;
}

.app-assets__top {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24px;
	margin-bottom: 28px;

	h1 {
		margin: 0;
		color: #f6f6f6;
		font-size: 24px;
		font-weight: 850;
		line-height: 1.1;
		letter-spacing: 0;
	}
}

.app-assets__create {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	gap: 8px;
	min-height: 36px;
	border: 0;
	border-radius: 8px;
	background: #fff;
	padding: 0 14px;
	color: #191919;
	font-size: 13px;
	font-weight: 800;
	cursor: pointer;
	transition: transform 160ms ease, background 160ms ease;

	span {
		font-size: 20px;
		font-weight: 500;
		line-height: 1;
	}

	&:hover {
		background: rgba(255, 255, 255, 0.88);
		transform: translateY(-1px);
	}
}

.app-assets__toolbar {
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 24px;
	margin-bottom: 30px;
}

.app-assets__filters {
	display: inline-flex;
	position: relative;
	border: 1px solid rgba(255, 255, 255, 0.11);
	border-radius: 10px;
	background: #080808;

	.app-assets-filter + .app-assets-filter {
		border-left: 1px solid rgba(255, 255, 255, 0.08);
	}
}

.app-assets-filter {
	position: relative;

	> button {
		display: inline-flex;
		align-items: center;
		justify-content: space-between;
		gap: 10px;
		height: 36px;
		min-width: 120px;
		border: 0;
		background: #080808;
		padding: 0 14px;
		color: rgba(255, 255, 255, 0.92);
		font: inherit;
		font-size: 14px;
		font-weight: 500;
		letter-spacing: 0;
		cursor: pointer;
	}

	> button svg {
		width: 14px;
		height: 14px;
		color: rgba(255, 255, 255, 0.4);
		transition: transform 160ms ease, color 160ms ease;
	}

	> button[aria-expanded="true"] svg {
		color: rgba(255, 255, 255, 0.72);
		transform: rotate(180deg);
	}
}

.app-assets-menu {
	position: absolute;
	top: calc(100% + 8px);
	z-index: 8;
	border: 1px solid rgba(255, 255, 255, 0.12);
	border-radius: 10px;
	background: #151515;
	box-shadow: 0 18px 60px rgba(0, 0, 0, 0.46);
}

.app-assets-menu--time {
	left: 0;
	width: min(380px, calc(100vw - 32px));
	padding: 12px 14px 14px;
	overflow: visible;
}

.app-assets-menu--type {
	left: 0;
	width: 180px;
	padding: 6px;
	background: #080808;
}

.app-assets-menu__dates {
	display: grid;
	grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
	align-items: center;
	gap: 8px;
	color: rgba(255, 255, 255, 0.34);
	font-size: 13px;
}

.app-assets-menu__dates + .app-assets-menu__option {
	margin-top: 12px;
}

.app-assets-date-field {
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

.app-assets-calendar {
	position: absolute;
	top: calc(100% + 8px);
	left: 0;
	z-index: 12;
	width: min(360px, calc(100vw - 32px));
	box-sizing: border-box;
	border: 1px solid rgba(255, 255, 255, 0.13);
	border-radius: 12px;
	background: #050505;
	box-shadow: 0 22px 64px rgba(0, 0, 0, 0.58);
	padding: 22px 24px 24px;
}

.app-assets-calendar__header {
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

.app-assets-calendar__weekdays,
.app-assets-calendar__grid {
	display: grid;
	grid-template-columns: repeat(7, minmax(0, 1fr));
	column-gap: 10px;
	row-gap: 10px;
}

.app-assets-calendar__weekdays {
	margin-bottom: 10px;

	span {
		color: rgba(255, 255, 255, 0.5);
		font-size: 15px;
		font-weight: 650;
		line-height: 30px;
		text-align: center;
	}
}

.app-assets-calendar__grid button {
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

.app-assets-menu__option {
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

.app-assets-menu--time .app-assets-menu__option {
	background: transparent;
}

.app-assets-menu--time .app-assets-menu__option:hover {
	background: rgba(255, 255, 255, 0.04);
}

.app-assets__search {
	display: flex;
	align-items: center;
	gap: 8px;
	width: min(300px, 100%);
	height: 36px;
	border: 1px solid rgba(255, 255, 255, 0.11);
	border-radius: 10px;
	background: #080808;
	padding: 0 12px;
	color: rgba(255, 255, 255, 0.38);

	svg {
		flex: 0 0 auto;
		width: 18px;
		height: 18px;
	}

	input {
		min-width: 0;
		width: 100%;
		border: 0;
		background: transparent;
		color: rgba(255, 255, 255, 0.82);
		font: inherit;
		font-size: 13px;
		outline: none;
	}

	input::placeholder {
		color: rgba(255, 255, 255, 0.26);
	}
}

.app-assets__list {
	display: grid;
	gap: 12px;
}

.app-assets-record {
	position: relative;
	overflow: hidden;
	border: 1px solid rgba(255, 255, 255, 0.08);
	border-radius: 12px;
	background: #050505;
	padding: 14px;

	header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		gap: 14px;
		min-height: 24px;
	}
}

.app-assets-record__meta {
	display: flex;
	align-items: center;
	flex-wrap: wrap;
	gap: 8px;
	color: rgba(255, 255, 255, 0.36);
	font-size: 12px;
	font-weight: 760;

	strong {
		color: rgba(255, 255, 255, 0.5);
		font-weight: 820;
	}

	span {
		border-radius: 5px;
		background: rgba(255, 255, 255, 0.08);
		padding: 2px 6px;
		color: rgba(255, 255, 255, 0.46);
		font-size: 10px;
		font-weight: 900;
		letter-spacing: 0.04em;
		text-transform: uppercase;
	}
}

.app-assets-record__open {
	display: grid;
	place-items: center;
	width: 24px;
	height: 24px;
	border: 0;
	border-radius: 999px;
	background: rgba(255, 214, 10, 0.08);
	color: #f6c400;
	cursor: pointer;

	svg {
		width: 15px;
		height: 15px;
	}
}

.app-assets-record__prompt {
	margin: 10px 0 14px;
	color: rgba(255, 255, 255, 0.47);
	font-size: 13px;
	font-weight: 650;
	line-height: 1.45;
}

.app-assets-record__failure {
	border: 1px solid rgba(239, 68, 68, 0.34);
	border-radius: 10px;
	background: rgba(127, 29, 29, 0.2);
	padding: 12px;
	color: rgba(255, 255, 255, 0.52);

	strong {
		display: inline-flex;
		align-items: center;
		gap: 6px;
		color: #ff5b5b;
		font-size: 12px;
		font-weight: 850;
	}

	svg {
		width: 14px;
		height: 14px;
	}

	p {
		margin: 10px 0 8px;
		font-size: 12px;
		font-weight: 650;
		line-height: 1.45;
	}

	small {
		display: block;
		color: rgba(255, 255, 255, 0.28);
		font-size: 11px;
		font-weight: 650;
	}
}

.app-assets-record__actions {
	display: grid;
	grid-template-columns: minmax(0, 1fr) 34px;
	gap: 8px;
	margin-top: 12px;

	button {
		display: inline-flex;
		align-items: center;
		justify-content: center;
		gap: 6px;
		height: 30px;
		border: 0;
		border-radius: 8px;
		background: rgba(255, 255, 255, 0.07);
		color: rgba(255, 255, 255, 0.54);
		font: inherit;
		font-size: 12px;
		font-weight: 750;
		cursor: pointer;
	}

	.is-danger {
		background: rgba(239, 68, 68, 0.13);
		color: #ef4444;
	}
}

.app-assets-record__image {
	width: 280px;
	max-width: 100%;
	overflow: hidden;
	border-radius: 8px;
	background: #141414;

	img {
		display: block;
		width: 100%;
		aspect-ratio: 1 / 1;
		object-fit: cover;
	}
}

.app-assets__empty {
	border: 1px dashed rgba(255, 255, 255, 0.14);
	border-radius: 14px;
	padding: 42px 20px;
	color: rgba(255, 255, 255, 0.48);
	text-align: center;
}

.sr-only {
	position: absolute;
	width: 1px;
	height: 1px;
	overflow: hidden;
	clip: rect(0, 0, 0, 0);
	white-space: nowrap;
}

@media (max-width: 1100px) {
	.app-assets__main {
		padding: 44px 28px;
	}
}

@media (max-width: 900px) {
	.app-assets,
	.app-assets.is-sidebar-collapsed {
		grid-template-columns: 1fr;
	}

	.app-assets__main {
		padding: 24px 16px 32px;
	}
}

@media (max-width: 720px) {
	.app-assets__top,
	.app-assets__toolbar {
		align-items: stretch;
		flex-direction: column;
	}

	.app-assets__search {
		width: 100%;
	}

	.app-assets__filters {
		width: 100%;

		label {
			flex: 1 1 0;
		}

		select {
			width: 100%;
		}
	}
}
</style>
