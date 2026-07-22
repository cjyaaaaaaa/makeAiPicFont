<template>
  <Teleport to="body">
    <Transition name="payment-celebration">
      <div
        v-if="open"
        class="celebration-backdrop"
        role="dialog"
        aria-modal="true"
        aria-labelledby="payment-success-title"
      >
        <div class="celebration-glow" aria-hidden="true"></div>
        <div class="celebration-rays" aria-hidden="true"></div>
        <span
          v-for="piece in confetti"
          :key="piece.id"
          class="confetti"
          :class="`confetti--${piece.color}`"
          :style="{
            left: piece.x,
            animationDelay: piece.delay,
            animationDuration: piece.duration,
            '--confetti-rotation': piece.rotate,
          }"
          aria-hidden="true"
        ></span>

        <section class="success-card">
          <div class="success-ripple" aria-hidden="true"></div>
          <div class="success-check" aria-hidden="true">
            <svg viewBox="0 0 64 64" fill="none">
              <path d="M18 33.5L27.5 43L47 22.5" stroke="currentColor" stroke-width="6" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </div>
          <p class="success-eyebrow">GPTPIX</p>
          <h2 id="payment-success-title">{{ t('pricing.checkout.successTitle') }}</h2>
          <p class="success-message">{{ t('pricing.checkout.successMessage') }}</p>
          <button ref="closeButton" type="button" @click="emit('close')">
            {{ t('pricing.checkout.close') }}
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path d="M5 12H19M14 7L19 12L14 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </section>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const props = defineProps<{ open: boolean }>()
const emit = defineEmits<{ close: [] }>()
const { t } = useAppI18n()
const closeButton = ref<HTMLButtonElement | null>(null)

const colors = ['yellow', 'white', 'violet'] as const
const confetti = Array.from({ length: 30 }, (_, index) => ({
  id: index,
  x: `${6 + ((index * 37) % 88)}%`,
  delay: `${(index % 10) * 65}ms`,
  duration: `${1150 + (index % 6) * 140}ms`,
  rotate: `${(index * 47) % 180}deg`,
  color: colors[index % colors.length],
}))

const onKeydown = (event: KeyboardEvent) => {
  if (event.key === 'Escape' && props.open) emit('close')
}

watch(() => props.open, async (open) => {
  if (!open) return
  await nextTick()
  closeButton.value?.focus()
})

onMounted(() => window.addEventListener('keydown', onKeydown))
onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.celebration-backdrop { position: fixed; inset: 0; z-index: 1000; display: grid; place-items: center; overflow: hidden; padding: 24px; background: rgba(7, 7, 8, .9); backdrop-filter: blur(14px); }
.celebration-glow { position: absolute; width: min(760px, 90vw); aspect-ratio: 1; border-radius: 50%; background: radial-gradient(circle, rgba(240, 212, 36, .27) 0, rgba(240, 212, 36, .09) 32%, transparent 70%); animation: glow-bloom 1.1s cubic-bezier(.2,.8,.2,1) both; }
.celebration-rays { position: absolute; width: min(680px, 86vw); aspect-ratio: 1; opacity: .32; background: repeating-conic-gradient(from 4deg, #f0d424 0deg 1.5deg, transparent 1.5deg 16deg); mask-image: radial-gradient(circle, transparent 0 21%, #000 31%, transparent 69%); animation: rays-arrive 1.5s cubic-bezier(.2,.75,.2,1) both, rays-turn 18s linear 1.5s infinite; }
.confetti { position: absolute; top: -8%; width: 8px; height: 19px; border-radius: 2px; opacity: 0; animation: confetti-fall cubic-bezier(.18,.65,.35,1) both; }
.confetti--yellow { background: #f0d424; }.confetti--white { background: #fff; }.confetti--violet { background: #8d7eff; }
.success-card { position: relative; z-index: 2; width: min(470px, 100%); overflow: hidden; border: 1px solid rgba(240,212,36,.3); border-radius: 28px; padding: 54px 42px 40px; text-align: center; color: #fff; background: linear-gradient(155deg, rgba(34,33,27,.98), rgba(20,20,21,.98) 65%); box-shadow: 0 35px 110px rgba(0,0,0,.65), 0 0 80px rgba(240,212,36,.1); animation: card-arrive .72s .16s cubic-bezier(.16,1,.3,1) both; }
.success-ripple { position: absolute; top: 72px; left: 50%; width: 90px; height: 90px; border: 1px solid rgba(240,212,36,.35); border-radius: 50%; transform: translate(-50%,-50%); animation: ripple 1.5s .58s ease-out both; }
.success-check { position: relative; z-index: 1; display: grid; width: 82px; height: 82px; margin: 0 auto 26px; place-items: center; border-radius: 50%; color: #181818; background: #f0d424; box-shadow: 0 0 0 12px rgba(240,212,36,.08), 0 0 45px rgba(240,212,36,.28); animation: check-pop .72s .38s cubic-bezier(.2,1.6,.4,1) both; }
.success-check svg { width: 48px; height: 48px; }.success-check path { stroke-dasharray: 46; stroke-dashoffset: 46; animation: check-draw .5s .82s ease-out forwards; }
.success-eyebrow { margin: 0 0 10px; color: #f0d424; font-size: 11px; font-weight: 900; letter-spacing: .28em; }
h2 { margin: 0; font-size: clamp(30px, 5vw, 43px); line-height: 1.08; font-weight: 850; }.success-message { max-width: 340px; margin: 16px auto 30px; color: rgba(255,255,255,.58); font-size: 15px; line-height: 1.7; }
button { display: inline-flex; min-width: 188px; min-height: 52px; align-items: center; justify-content: center; gap: 10px; border: 0; border-radius: 999px; padding: 0 26px; color: #171717; background: #f0d424; font-size: 14px; font-weight: 850; cursor: pointer; transition: transform .25s ease, background-color .25s ease, box-shadow .25s ease; } button:hover { transform: translateY(-2px); background: #ffe43b; box-shadow: 0 14px 35px rgba(240,212,36,.18); } button:focus-visible { outline: 3px solid #fff; outline-offset: 4px; } button svg { width: 18px; height: 18px; }
.payment-celebration-enter-active,.payment-celebration-leave-active { transition: opacity .35s ease; }.payment-celebration-enter-from,.payment-celebration-leave-to { opacity: 0; }
@keyframes card-arrive { from { opacity: 0; transform: translateY(30px) scale(.88); } to { opacity: 1; transform: none; } }
@keyframes glow-bloom { from { opacity: 0; transform: scale(.35); } to { opacity: 1; transform: scale(1); } }
@keyframes rays-arrive { from { opacity: 0; transform: scale(.25) rotate(-25deg); } to { opacity: .32; transform: scale(1) rotate(0); } }
@keyframes rays-turn { to { transform: rotate(360deg); } }
@keyframes check-pop { from { opacity: 0; transform: scale(.2) rotate(-18deg); } to { opacity: 1; transform: scale(1) rotate(0); } }
@keyframes check-draw { to { stroke-dashoffset: 0; } }
@keyframes ripple { from { opacity: .8; transform: translate(-50%,-50%) scale(.75); } to { opacity: 0; transform: translate(-50%,-50%) scale(2.4); } }
@keyframes confetti-fall { 0% { opacity: 0; transform: translateY(-10vh) rotate(var(--confetti-rotation)); } 14% { opacity: 1; } 100% { opacity: .75; transform: translateY(112vh) rotate(calc(var(--confetti-rotation) + 540deg)); } }
@media (max-width: 520px) { .success-card { border-radius: 22px; padding: 46px 24px 32px; }.success-check { width: 72px; height: 72px; } }
@media (prefers-reduced-motion: reduce) { .celebration-glow,.celebration-rays,.confetti,.success-card,.success-ripple,.success-check,.success-check path { animation: none; }.confetti,.success-ripple { display: none; }.payment-celebration-enter-active,.payment-celebration-leave-active,button { transition: none; } }
</style>
