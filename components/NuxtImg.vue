<template>
	<img :src="src" :alt="alt" :loading="loading" :decoding="decoding" />
</template>

<script setup lang="ts">
withDefaults(defineProps<{
	src: string
	alt?: string
	loading?: 'lazy' | 'eager'
	decoding?: 'async' | 'auto' | 'sync'
}>(), {
	alt: '',
	loading: 'lazy',
	decoding: 'async',
})
</script>
