<template>
	<LegalDocumentPage
		:title="doc.title"
		:intro="doc.intro"
		:updated-label="updatedLabel"
		:company="company"
		:contact-email="contactEmail"
		:contact-label="contactLabel"
		:sections="doc.sections"
	/>
</template>

<script setup lang="ts">
import LegalDocumentPage, { type LegalSection } from '~/components/home/LegalDocumentPage.vue'

const { t } = useAppI18n()

const company = computed(() => String(t('legal.company')))
const contactEmail = computed(() => String(t('legal.contactEmail')))
const contactLabel = computed(() => String(t('legal.contactLabel')))
const updatedLabel = computed(() => String(t('legal.updatedLabel', { date: t('legal.updatedAt') })))

const doc = computed(() => {
	const value = t('legal.terms') as {
		title?: string
		intro?: string
		sections?: LegalSection[]
	}
	return {
		title: value?.title || 'Terms of Service',
		intro: value?.intro || '',
		sections: Array.isArray(value?.sections) ? value.sections : [],
	}
})

useHead(() => ({
	title: `${doc.value.title} | ${company.value}`,
	meta: [
		{ name: 'description', content: doc.value.intro || doc.value.title },
	],
}))
</script>
