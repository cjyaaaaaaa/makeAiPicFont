type LazyImageOptions = {
	alt?: string
	eager?: boolean
}

type LazyImageAttrs = {
	src: string
	alt: string
	loading: 'lazy' | 'eager'
	decoding: 'async'
}

export const useLazyImage = () => {
	const getLazyImageAttrs = (src: string, options: LazyImageOptions = {}): LazyImageAttrs => ({
		src,
		alt: options.alt ?? '',
		loading: options.eager ? 'eager' : 'lazy',
		decoding: 'async',
	})

	return {
		getLazyImageAttrs,
	}
}
