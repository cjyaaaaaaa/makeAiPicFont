export interface ThirdPartyLoginPayload {
	provider: 'google'
	credential: string
}

export const getUser = () => {
	const request = useRequest()
	return request('/user')
}

export const thirdPartyLoginController = (data: ThirdPartyLoginPayload) => {
	const request = useRequest()
	return request('/user/auth/third-party/login', {
		method: 'POST',
		body: data,
	})
}
