<template>
  <section class="bg-[#f6f2ea] px-0 py-16 md:py-20 lg:py-24">
    <div class="al-container max-w-[1152px] px-4 md:px-6 lg:px-6">
      <div class="border-b border-[#1a1a17]/[0.14] pb-10 md:pb-12">
        <p
          class="font-mono text-[12px] uppercase leading-4 tracking-[0.6px] text-[#e5482d]"
        >
          {{ t("home.gallery.eyebrow") }}
        </p>
        <div class="mt-6 max-w-[672px]">
          <h2
            class="text-[42px] font-medium leading-[48px] tracking-[-1.2px] text-[#1a1a17] md:text-[48px]"
          >
            {{ t("home.gallery.title") }}
          </h2>
          <p class="mt-4 max-w-[448px] text-[16px] leading-6 text-[#6c6a61]">
            {{ t("home.gallery.desc") }}
          </p>
        </div>
      </div>

      <div class="grid border-b border-[#1a1a17]/[0.14] md:grid-cols-4">
        <article
          v-for="card in cards"
          :key="card.id"
          class="border-b border-r border-[#1a1a17]/[0.14] px-6 pb-6 pt-6 last:border-r-0 md:h-[217px]"
        >
          <p class="font-mono text-[12px] leading-4 text-[#6c6a61]">
            {{ card.no }}
          </p>
          <h3
            class="pt-6 text-[18px] font-medium leading-[27px] tracking-[-0.36px] text-[#1a1a17]"
          >
            {{ card.title }}
          </h3>
          <p class="pt-2 text-[14px] leading-5 text-[#6c6a61]">
            {{ card.desc }}
          </p>
          <div class="mt-6 h-px w-8 bg-[#e5482d]"></div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const { t } = useI18n();

const cards = computed(
  () =>
    t("home.gallery.cards") as Array<{
      id: string;
      no: string;
      title: string;
      desc: string;
    }>,
);
</script>
