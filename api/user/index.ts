export interface ThirdPartyLoginPayload {
	provider: 'google'
	credential: string
}

export interface SendEmailCodePayload {
	email: string
	purpose: 'register' | 'reset_password' | 'set_password'
}

export interface ApiResponse<T> {
	code: number
	msg: string
	data: T
}

export interface UserProfile {
	userId: number
	site: string
	userName: string
	nickName: string
	email: string
	avatar: string
	creditBalance: number
	emailVerified: string
	passwordLoginEnabled: string
}

export interface LoginData {
	token?: string
	accessToken?: string
	access_token?: string
}

export const getUser = () => {
	const request = useRequest()
	return request<ApiResponse<UserProfile>>('/user/profile')
}

export const thirdPartyLoginController = (data: ThirdPartyLoginPayload) => {
	const request = useRequest()
	return request<ApiResponse<LoginData | string>>('/user/auth/third-party/login', {
		method: 'POST',
		body: data,
	})
}

export const sendEmailCodeController = async (
	email: string,
	purpose: SendEmailCodePayload['purpose'] = 'register',
) => {
	const request = useRequest()
	try {
		const response = await request<ApiResponse<null>>('/user/auth/email/code', {
			method: 'POST',
			body: { email, purpose },
		})

		return response.code === 200
	} catch {
		return false
	}
}
