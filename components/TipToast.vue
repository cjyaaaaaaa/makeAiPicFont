<template>
	<Teleport to="body">
		<Transition name="tip-toast-fade">
			<div v-if="visible" class="fixed inset-x-0 top-5 z-[120] flex justify-center px-4 sm:top-6">
				<div class="tip-toast" :class="variantClass" role="status" aria-live="polite">
					<div class="tip-toast__icon" :class="iconClass">{{ icon }}</div>
					<div class="min-w-0 flex-1">
						<p class="text-[14px] font-semibold leading-5 text-[#111111]">{{ title }}</p>
						<p v-if="message" class="mt-0.5 text-[13px] leading-5 text-[#5e5b54]">{{ message }}</p>
					</div>
				</div>
			</div>
		</Transition>
	</Teleport>
</template>

<script setup lang="ts">
type TipType = 'success' | 'error' | 'info'

const visible = ref(false)
const title = ref('')
const message = ref('')
const type = ref<TipType>('info')
let timer: ReturnType<typeof setTimeout> | null = null

const variantClass = computed(() => {
	if (type.value === 'success') return 'tip-toast--success'
	if (type.value === 'error') return 'tip-toast--error'
	return 'tip-toast--info'
})

const iconClass = computed(() => {
	if (type.value === 'success') return 'tip-toast__icon--success'
	if (type.value === 'error') return 'tip-toast__icon--error'
	return 'tip-toast__icon--info'
})

const icon = computed(() => {
	if (type.value === 'success') return '✓'
	if (type.value === 'error') return '!'
	return 'i'
})

const close = () => {
	visible.value = false
	if (timer) {
		clearTimeout(timer)
		timer = null
	}
}

const show = (payload: { title: string; message?: string; type?: TipType; duration?: number }) => {
	close()
	type.value = payload.type ?? 'info'
	title.value = payload.title
	message.value = payload.message ?? ''
	visible.value = true
	timer = setTimeout(() => {
		visible.value = false
		timer = null
	}, payload.duration ?? 2200)
}

defineExpose({ show, close })

onBeforeUnmount(() => close())
</script>

<style scoped>
.tip-toast-fade-enter-active,
.tip-toast-fade-leave-active {
	transition: opacity 180ms ease, transform 180ms ease;
}
.tip-toast-fade-enter-from,
.tip-toast-fade-leave-to {
	opacity: 0;
	transform: translateY(-10px) scale(0.98);
}

.tip-toast {
	display: flex;
	align-items: center;
	gap: 12px;
	width: min(420px, 100%);
	border-radius: 18px;
	border: 1px solid rgba(17, 17, 17, 0.08);
	background: rgba(255, 255, 255, 0.94);
	padding: 14px 16px;
	box-shadow: 0 20px 60px rgba(0, 0, 0, 0.14);
	backdrop-filter: blur(16px);
}

.tip-toast__icon {
	display: grid;
	place-items: center;
	width: 30px;
	height: 30px;
	border-radius: 999px;
	font-size: 14px;
	font-weight: 700;
	flex: 0 0 auto;
}

.tip-toast--success .tip-toast__icon,
.tip-toast__icon--success {
	background: #e7f8ef;
	color: #1d7a43;
}

.tip-toast--error .tip-toast__icon,
.tip-toast__icon--error {
	background: #fdecec;
	color: #c43b3b;
}

.tip-toast--info .tip-toast__icon,
.tip-toast__icon--info {
	background: #edf3ff;
	color: #355dcb;
}

.tip-toast--success {
	border-color: rgba(29, 122, 67, 0.16);
}
.tip-toast--error {
	border-color: rgba(196, 59, 59, 0.16);
}
.tip-toast--info {
	border-color: rgba(53, 93, 203, 0.16);
}
</style>
