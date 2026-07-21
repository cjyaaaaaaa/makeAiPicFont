<template>
  <div class="min-h-screen pb-[90px] pt-[122px] text-[#f5f5f5] max-sm:pb-[60px] max-sm:pt-[105px]">
    <section class="mx-auto mb-[86px] max-w-[820px] text-center max-sm:mb-[60px]">
      <h1 class="m-0 text-[clamp(40px,4vw,58px)] font-bold leading-[1.1] tracking-normal max-sm:text-[38px]">
        {{ t('pricing.title') }}
      </h1>
      <div class="mt-[42px] inline-flex rounded-full bg-[#1c1c1d] p-[7px] max-sm:mt-[30px]" :aria-label="t('pricing.monthlyOnly')">
        <span class="block min-w-[120px] rounded-full bg-[#303031] px-[22px] py-[10px] text-[14px] font-semibold text-white">
          {{ t('pricing.monthly') }}
        </span>
      </div>
      <p class="mt-[14px] text-[12px] text-[#d5bb24]">{{ t('pricing.monthlyNote') }}</p>
    </section>

    <section class="mx-auto grid max-w-[1320px] grid-cols-4 items-stretch gap-4 max-[1100px]:max-w-[760px] max-[1100px]:grid-cols-2 max-sm:max-w-[420px] max-sm:grid-cols-1 max-sm:gap-[22px]" :aria-label="t('pricing.title')">
      <article
        v-for="plan in plans"
        :key="plan.id"
        class="plan-card group relative flex min-h-[650px] min-w-0 flex-col overflow-visible rounded-[8px] border border-[#303031] bg-[#19191a] px-7 py-8 shadow-[0_18px_45px_rgba(0,0,0,0)] transition-[transform,border-color,background-color,box-shadow] duration-[380ms] ease-[cubic-bezier(.2,.75,.25,1)] motion-reduce:transition-none max-sm:min-h-0 max-sm:px-6 max-sm:py-7"
        :class="plan.featured ? 'border-[#645919] bg-[#1c1b18] hover:border-[#9d8c20] hover:bg-[#201f19] hover:shadow-[0_28px_68px_rgba(0,0,0,.34),0_12px_38px_rgba(240,212,36,.07)]' : 'hover:border-[#515153] hover:bg-[#1c1c1d] hover:shadow-[0_28px_64px_rgba(0,0,0,.32)]'"
      >
        <span class="card-sweep" :class="{ 'card-sweep--featured': plan.featured }" aria-hidden="true"></span>
        <div v-if="plan.featured" class="absolute left-1/2 top-0 z-10 -translate-x-1/2 -translate-y-1/2 whitespace-nowrap rounded-full bg-[#f0d424] px-[19px] py-[6px] text-[10px] font-extrabold uppercase text-[#161616]">
          {{ t('pricing.popular') }}
        </div>
        <div v-if="plan.discount" class="mb-[18px] w-fit rounded-full bg-[#403b1b] px-3 py-[6px] text-[11px] font-bold uppercase text-[#f0d424]">
          {{ plan.discount }}
        </div>
        <h2 class="m-0 text-[20px] font-bold">{{ plan.name }}</h2>

        <div class="mt-6 flex min-h-[74px] items-baseline text-[#77776f]">
          <template v-if="plan.price === 0">
            <strong class="price-value text-[50px] font-semibold leading-none text-[#fafafa] transition-transform duration-300 group-hover:-translate-y-[3px] motion-reduce:transition-none">{{ t('pricing.free') }}</strong>
          </template>
          <template v-else>
            <span class="mr-[6px] text-[14px]">$</span>
            <strong class="price-value text-[50px] font-semibold leading-none text-[#fafafa] transition-transform duration-300 group-hover:-translate-y-[3px] motion-reduce:transition-none">{{ plan.price }}</strong>
            <del v-if="plan.oldPrice" class="ml-3 text-[14px] text-[#6f6f68]">${{ plan.oldPrice }}</del>
            <small class="ml-[6px] text-[13px] text-[#77776f]">/ {{ t('pricing.month') }}</small>
          </template>
        </div>

        <div class="mb-6 mt-[-2px] flex items-baseline gap-[5px] text-[12px] text-[#74746e]">
          <strong class="text-[12px] text-[#a7a7a1]">{{ plan.credits }} {{ t('pricing.credits') }}</strong>
          <span>{{ plan.id === 'free' ? t('pricing.perDay') : t('pricing.perMonth') }}</span>
        </div>

        <button
          type="button"
          class="flex min-h-[46px] w-full items-center justify-center gap-2 rounded-full border border-[#383839] bg-transparent text-[13px] font-bold text-[#eee] transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-0.5 hover:border-[#626263] hover:bg-[#222223] hover:shadow-[0_10px_25px_rgba(0,0,0,.22)] disabled:cursor-default disabled:bg-[#252526] disabled:text-[#999] motion-reduce:transition-none"
          :class="plan.featured ? '!border-[#f0d424] !bg-[#f0d424] !text-[#171717] hover:!bg-[#ffe33a]' : ''"
          :disabled="plan.id === 'free' && checkedInToday"
          @click="plan.id === 'free' ? handleCheckIn() : handleSubscribe(plan)"
        >
          <svg v-if="plan.id === 'free' && !checkedInToday" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[3px] motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M7 4V7M17 4V7M4.5 10H19.5M6 5.5H18C18.8 5.5 19.5 6.2 19.5 7V19C19.5 19.8 18.8 20.5 18 20.5H6C5.2 20.5 4.5 19.8 4.5 19V7C4.5 6.2 5.2 5.5 6 5.5Z" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" />
            <path d="M8.5 15L11 17.5L15.8 12.5" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          <svg v-else-if="plan.id !== 'free'" class="h-4 w-4 transition-transform duration-300 group-hover:translate-x-[3px] motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M5 12H19M14 7L19 12L14 17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ plan.id === 'free' ? (checkedInToday ? t('pricing.checkedIn') : t('pricing.checkIn')) : t('pricing.subscribe') }}
        </button>

        <div class="my-6 h-px bg-[#2a2a2b]"></div>
        <p class="mb-[18px] text-[13px] font-bold text-[#e4e4e2]">{{ t('pricing.includes') }}</p>
        <ul class="m-0 grid list-none gap-[15px] p-0">
          <li v-for="(feature, index) in plan.features" :key="feature" class="feature-row flex items-start gap-[10px] text-[13px] leading-[1.45] text-[#a4a4a0] transition-[transform,color] duration-300 group-hover:translate-x-1 group-hover:text-[#c0c0bc] motion-reduce:transition-none" :style="{ transitionDelay: `${40 + index * 35}ms` }">
            <svg class="h-4 w-4 flex-none" :class="plan.featured ? 'text-[#e0c923]' : 'text-[#85877d]'" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M4 10.5L8 14.5L16 6.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span>{{ feature }}</span>
          </li>
        </ul>
      </article>
    </section>

    <section class="mx-auto mt-[120px] grid max-w-[1300px] grid-cols-[1fr_1.4fr] gap-[45px] rounded-[8px] bg-[#0d0d0e] px-[52px] py-12 max-[1100px]:max-w-[760px] max-[1100px]:grid-cols-1 max-sm:mt-[70px] max-sm:px-[22px] max-sm:py-[30px]">
      <div>
        <h2 class="m-0 text-[29px] font-bold">{{ t('pricing.packs.title') }}</h2>
        <p class="mt-4 max-w-[470px] text-[14px] leading-[1.65] text-[#9a9a97]">{{ t('pricing.packs.description') }}</p>
      </div>
      <div class="grid grid-cols-3 gap-4 max-sm:grid-cols-1">
        <button v-for="pack in creditPacks" :key="pack.credits" type="button" class="flex min-h-[108px] flex-col items-start justify-center gap-[9px] rounded-[8px] border border-[#3b3b3c] bg-[#2b2b2c] px-6 py-5 transition-[transform,border-color,background-color,box-shadow] duration-300 hover:-translate-y-[5px] hover:border-[#777052] hover:bg-[#303031] hover:shadow-[0_18px_35px_rgba(0,0,0,.28)] motion-reduce:transition-none" @click="handlePack(pack)">
          <strong class="text-[18px] text-[#f0d424]">{{ pack.credits }} {{ t('pricing.credits') }}</strong>
          <span class="text-[22px] font-bold text-white">${{ pack.price }}</span>
        </button>
      </div>
    </section>

    <section class="mx-auto mt-[115px] text-center max-sm:mt-[70px]">
      <h2 class="m-0 text-[34px] font-bold max-sm:text-[28px]">{{ t('pricing.costsTitle') }}</h2>
      <p class="mt-[15px] text-[15px] text-[#75756f]">{{ t('pricing.costsSubtitle') }}</p>
    </section>

    <section class="mx-auto mt-10 max-w-[1320px] overflow-hidden rounded-[8px] border border-white/10 bg-[#19191a]">
      <div class="overflow-x-auto">
        <table class="w-full min-w-[920px] table-fixed border-collapse text-left">
          <thead>
            <tr class="border-b border-white/10">
              <th class="w-[30%] px-5 py-7 text-[10px] font-bold uppercase text-white/35">{{ t('pricing.table.model') }}</th>
              <th v-for="(plan, index) in plans" :key="plan.id" class="px-3 py-5 text-center" :class="plan.featured ? 'bg-[#211f19]' : ''">
                <strong class="block text-[13px] text-white">{{ plan.name }}</strong>
                <span class="mt-2 block text-[22px] font-bold text-white">
                  {{ plan.price === 0 ? '$0' : `$${plan.price}` }}
                  <del v-if="plan.oldPrice" class="ml-1 text-[11px] font-normal text-white/35">${{ plan.oldPrice }}</del>
                </span>
                <small class="mt-1 block text-[10px] text-white/35">{{ plan.credits }} {{ t('pricing.credits') }} / {{ index === 0 ? t('pricing.table.day') : t('pricing.table.month') }}</small>
                <button type="button" class="mt-3 min-h-[32px] min-w-[108px] rounded-full border border-white/10 px-4 text-[11px] font-bold transition hover:border-white/25 hover:bg-white/5" :class="plan.featured ? '!border-[#f0d424] bg-[#f0d424] text-[#171717] hover:bg-[#ffe33a]' : 'text-white/80'" @click="plan.id === 'free' ? handleCheckIn() : handleSubscribe(plan)">
                  {{ plan.id === 'free' ? t('pricing.table.tryNow') : t('pricing.table.upgrade') }}
                </button>
              </th>
            </tr>
          </thead>
          <tbody>
            <tr><th colspan="5" class="bg-[#141415] px-5 py-4 text-[10px] font-extrabold uppercase text-[#f0d424]">{{ t('pricing.table.imageModels') }}</th></tr>
            <tr v-for="row in creditCostRows" :key="row.key" class="border-t border-white/[0.055] transition-colors hover:bg-white/[0.025]">
              <td class="px-5 py-[15px]">
                <strong class="block text-[13px] font-semibold text-white/85">{{ row.name }} <span class="ml-1 font-normal text-white/35">{{ row.resolution }}</span></strong>
                <small class="mt-1 block text-[10px] text-white/40">{{ row.cost }} {{ t('pricing.table.creditsPerImage') }}</small>
              </td>
              <td v-for="(amount, index) in row.generations" :key="index" class="px-3 py-[15px] text-center" :class="index === 2 ? 'bg-[#211f19]/70' : ''">
                <strong class="text-[13px] font-semibold" :class="index === 3 ? 'text-[#f0d424]' : 'text-white/70'">{{ amount.toLocaleString() }}</strong>
                <small class="ml-1 text-[9px] text-white/30">{{ t('pricing.table.images') }}</small>
              </td>
            </tr>
            <tr><th colspan="5" class="bg-[#141415] px-5 py-4 text-[10px] font-extrabold uppercase text-[#f0d424]">{{ t('pricing.table.videoModels') }}</th></tr>
            <tr v-for="row in videoCostRows" :key="row.key" class="border-t border-white/[0.055] transition-colors hover:bg-white/[0.025]">
              <td class="px-5 py-[15px]">
                <strong class="block text-[13px] font-semibold text-white/85">{{ row.name }} <span class="ml-1 font-normal text-white/35">{{ row.resolution }}</span></strong>
                <small class="mt-1 block text-[10px] text-white/40">{{ row.rate }} {{ t('pricing.table.creditsPerSecond') }} · {{ tableVideoDuration }}s</small>
              </td>
              <td v-for="(amount, index) in row.generations" :key="index" class="px-3 py-[15px] text-center" :class="index === 2 ? 'bg-[#211f19]/70' : ''">
                <strong class="text-[13px] font-semibold" :class="index === 3 ? 'text-[#f0d424]' : 'text-white/70'">{{ amount.toLocaleString() }}</strong>
                <small class="ml-1 text-[9px] text-white/30">{{ t('pricing.table.videos') }}</small>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>

    <section class="mx-auto mt-[115px] max-w-[1320px] max-sm:mt-[75px]">
      <h2 class="m-0 text-[34px] font-bold max-sm:text-[28px]">{{ t('pricing.faq.title') }}</h2>
      <div class="mt-10 grid gap-4 max-sm:mt-7">
        <article v-for="(item, index) in faqItems" :key="item.question" class="overflow-hidden rounded-[8px] border border-white/[0.08] bg-[#1b1b1c] transition-colors hover:border-white/[0.14]">
          <button type="button" class="flex w-full items-center justify-between gap-6 px-6 py-5 text-left max-sm:px-5" :aria-expanded="openFaqs.includes(index)" @click="toggleFaq(index)">
            <strong class="text-[14px] font-semibold text-white/90">{{ item.question }}</strong>
            <svg class="h-4 w-4 flex-none text-[#f0d424] transition-transform duration-300 motion-reduce:transition-none" :class="openFaqs.includes(index) ? 'rotate-180' : ''" viewBox="0 0 20 20" fill="none" aria-hidden="true">
              <path d="M5 7.5L10 12.5L15 7.5" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <div class="grid transition-[grid-template-rows] duration-300 ease-out motion-reduce:transition-none" :class="openFaqs.includes(index) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'">
            <div class="overflow-hidden">
              <p class="m-0 px-6 pb-6 text-[13px] leading-7 text-white/55 max-sm:px-5">{{ item.answer }}</p>
            </div>
          </div>
        </article>
      </div>
    </section>

    <section class="mx-auto mt-[115px] flex min-h-[390px] max-w-[1320px] flex-col items-center justify-center overflow-hidden rounded-[8px] border border-[#3d3815] bg-[#16160f] px-8 py-16 text-center max-sm:mt-[75px] max-sm:min-h-[310px] max-sm:px-5">
      <h2 class="m-0 max-w-[1050px] text-[clamp(38px,5vw,68px)] font-bold leading-[1.08] tracking-normal text-white">
        {{ t('pricing.cta.title') }}
      </h2>
      <NuxtLink :to="imageGeneratorPath" class="group mt-10 inline-flex min-h-[68px] min-w-[250px] items-center justify-center gap-3 rounded-full bg-[#f0d424] px-9 text-[18px] font-extrabold text-[#171717] shadow-[0_16px_40px_rgba(240,212,36,.08)] transition-[transform,background-color,box-shadow] duration-300 hover:-translate-y-1 hover:bg-[#ffe43b] hover:shadow-[0_20px_48px_rgba(240,212,36,.16)] motion-reduce:transition-none max-sm:min-h-[60px] max-sm:min-w-[220px] max-sm:text-[16px]">
        <span>{{ t('pricing.cta.action') }}</span>
        <svg class="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1 motion-reduce:transition-none" viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path d="M5 12H19M14 7L19 12L14 17" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>
    </section>

    <p class="mx-auto mt-[35px] text-center text-[11px] text-[#686863]">{{ t('pricing.note') }}</p>
    <LoginModal :open="loginOpen" @close="loginOpen = false" />
  </div>
</template>

<script setup lang="ts">
import LoginModal from '~/components/auth/LoginModal.vue'
import { getModelCredits, type ImageModelId, type ResolutionValue } from '~/components/home/app/AIimage'
import { getVideoCredits, VIDEO_CREDITS_PER_SECOND, type VideoResolutionValue } from '~/components/home/app/AIVideo'

type Plan = { id: 'free' | 'starter' | 'pro' | 'ultra'; name: string; description: string; price: number; oldPrice?: number; discount?: string; credits: string; featured?: boolean; features: string[] }

const { t } = useAppI18n()
const route = useRoute()
const { user } = useUser()
const { showTipToast } = useTipToast()
const loginOpen = ref(false)
const checkedInToday = ref(false)
const imageGeneratorPath = computed(() => {
  const localePrefix = route.path.split('/').filter(Boolean)[0]
  return ['zh', 'de', 'es', 'ja'].includes(localePrefix)
    ? `/${localePrefix}/ai-image-generator`
    : '/ai-image-generator'
})
const openFaqs = ref<number[]>([0])
const creditPacks = [{ credits: '2,000', price: 20 }, { credits: '5,000', price: 50 }, { credits: '12,000', price: 100 }]
const todayKey = () => new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Shanghai' }).format(new Date())
const checkInStorageKey = computed(() => `gptpix-check-in:${user.value?.userId || 'guest'}`)

const plans = computed<Plan[]>(() => [
  { id: 'free', name: t('pricing.plans.free.name'), description: t('pricing.plans.free.description'), price: 0, credits: '40', features: [t('pricing.features.daily'), t('pricing.features.models'), t('pricing.features.standard')] },
  { id: 'starter', name: t('pricing.plans.starter.name'), description: t('pricing.plans.starter.description'), price: 9.9, credits: '5,000', features: [t('pricing.features.imageVideo'), t('pricing.features.commercial'), t('pricing.features.storage30')] },
  { id: 'pro', name: t('pricing.plans.pro.name'), description: t('pricing.plans.pro.description'), price: 15.9, oldPrice: 19.9, discount: '20% OFF', credits: '1,000', featured: true, features: [t('pricing.features.allTools'), t('pricing.features.priority'), t('pricing.features.commercial'), t('pricing.features.storage365')] },
  { id: 'ultra', name: t('pricing.plans.ultra.name'), description: t('pricing.plans.ultra.description'), price: 49.9, credits: '30,000', features: [t('pricing.features.allTools'), t('pricing.features.fastest'), t('pricing.features.prioritySupport'), t('pricing.features.unlimited')] },
])

const tableModels: Array<{ key: string; name: string; modelId: ImageModelId; resolution: ResolutionValue }> = [
  { key: 'nano-banana-2-1k', name: 'Nano Banana 2', modelId: 'nano-banana-2', resolution: '1K' },
  { key: 'nano-banana-2-2k', name: 'Nano Banana 2', modelId: 'nano-banana-2', resolution: '2K' },
  { key: 'nano-banana-2-4k', name: 'Nano Banana 2', modelId: 'nano-banana-2', resolution: '4K' },
  { key: 'nano-banana-pro-1k', name: 'Nano Banana Pro', modelId: 'nano-banana-pro', resolution: '1K' },
  { key: 'nano-banana-pro-2k', name: 'Nano Banana Pro', modelId: 'nano-banana-pro', resolution: '2K' },
  { key: 'nano-banana-pro-4k', name: 'Nano Banana Pro', modelId: 'nano-banana-pro', resolution: '4K' },
  { key: 'nano-banana', name: 'Nano Banana', modelId: 'nano-banana', resolution: '1K' },
  { key: 'gpt-image-2', name: 'GPT Image 2', modelId: 'gpt-image-2', resolution: '1K' },
]
const planCreditAllowances = [40, 5000, 1000, 30000]
const creditCostRows = computed(() => tableModels.map((model) => {
  const cost = getModelCredits(model.modelId, 'medium', model.resolution, false, 1)
  return { ...model, cost, generations: planCreditAllowances.map(credits => Math.floor(credits / cost)) }
}))
const tableVideoDuration = 4
const videoResolutions: VideoResolutionValue[] = ['480p', '720p', '1080p', '4k']
const videoCostRows = computed(() => videoResolutions.map((resolution) => {
  const cost = getVideoCredits(tableVideoDuration, resolution)
  return {
    key: `seedance-2-${resolution}`,
    name: 'Seedance 2',
    resolution,
    rate: VIDEO_CREDITS_PER_SECOND[resolution],
    generations: planCreditAllowances.map(credits => Math.floor(credits / cost)),
  }
}))
const faqItems = computed(() => Array.from({ length: 9 }, (_, index) => ({
  question: t(`pricing.faq.items.${index}.question`),
  answer: t(`pricing.faq.items.${index}.answer`),
})))
const toggleFaq = (index: number) => {
  openFaqs.value = openFaqs.value.includes(index)
    ? openFaqs.value.filter(item => item !== index)
    : [...openFaqs.value, index]
}

const syncCheckInState = () => {
  if (!import.meta.client || !user.value) { checkedInToday.value = false; return }
  checkedInToday.value = localStorage.getItem(checkInStorageKey.value) === todayKey()
}
const handleCheckIn = () => {
  if (!user.value) { loginOpen.value = true; return }
  if (checkedInToday.value) return
  localStorage.setItem(checkInStorageKey.value, todayKey())
  user.value.creditBalance = (user.value.creditBalance ?? 0) + 40
  checkedInToday.value = true
  showTipToast({ title: t('pricing.checkInSuccess'), message: t('pricing.checkInSuccessMessage'), type: 'success' })
}
const handleSubscribe = (plan: Plan) => {
  if (!user.value) { loginOpen.value = true; return }
  showTipToast({ title: t('pricing.paymentSoon'), message: t('pricing.paymentSoonMessage', { plan: plan.name }), type: 'info' })
}
const handlePack = (pack: { credits: string; price: number }) => {
  if (!user.value) { loginOpen.value = true; return }
  showTipToast({ title: t('pricing.paymentSoon'), message: `${pack.credits} ${t('pricing.credits')} · $${pack.price}`, type: 'info' })
}

onMounted(syncCheckInState)
watch(() => user.value?.userId, syncCheckInState)
useHead({ title: () => `${t('pricing.title')} | gptpix.ai` })
</script>

<style scoped>
.card-sweep { position: absolute; z-index: 0; top: -1px; left: 7%; width: 28%; height: 2px; border-radius: 999px; background: #a3a39d; opacity: 0; transform: translateX(-20px) scaleX(.25); transform-origin: left center; transition: transform .55s cubic-bezier(.2,.75,.25,1), opacity .2s ease; }
.card-sweep--featured { background: #f0d424; }
.plan-card:hover { transform: translateY(-9px); }
.plan-card:hover .card-sweep { opacity: 1; transform: translateX(205%) scaleX(1); }
@media (prefers-reduced-motion: reduce) { .card-sweep, .plan-card { transition: none; } .plan-card:hover { transform: none; } }
</style>
