export const useRequest = () => {
	const { $request } = useNuxtApp()
	return $request as typeof $fetch
}
