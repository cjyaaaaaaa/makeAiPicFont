export interface ThirdPartyLoginPayload {
	provider: 'google'
	credential: string
}

export interface SendEmailCodePayload {
	email: string
	purpose: 'user_register' | 'user_reset_password' | 'user_set_password'
}

export interface EmailLoginPayload {
	email: string
	password: string
}

export interface EmailRegisterPayload {
	email: string
	code: string
	password: string
	nickName?: string
}

export interface ResetPasswordPayload {
	email: string
	code: string
	newPassword: string
}

export interface ApiResponse<T> {
	code: number | string
	msg: string
	data: T
}

export interface UserProfile {
	userId: string
	site: string | null
	userName: string
	nickName?: string | null
	email: string
	avatar: string | null
	creditBalance: number
	emailVerified: string
	passwordLoginEnabled: string
}

export interface LoginData {
	token?: string
	accessToken?: string
	access_token?: string
}

const extractAuthToken = (response: unknown) => {
	if (!response || typeof response !== 'object') return ''

	const payload = response as {
		data?:
			| string
			| {
					token?: string
					accessToken?: string
					access_token?: string
			  }
		token?: string
		accessToken?: string
		access_token?: string
	}

	if (typeof payload.data === 'string') return payload.data
	return (
		payload.data?.token ??
		payload.data?.accessToken ??
		payload.data?.access_token ??
		payload.token ??
		payload.accessToken ??
		payload.access_token ??
		''
	)
}

const isSuccessResponse = (response: unknown) => {
	if (!response || typeof response !== 'object') return false
	const payload = response as { code?: number | string }
	return payload.code === undefined || Number(payload.code) === 200
}

export const getUser = () => {
	const request = useRequest()
	return request<ApiResponse<UserProfile>>('/user/profile')
}

export const thirdPartyLoginController = async (data: ThirdPartyLoginPayload) => {
	const request = useRequest()
	try {
		const response = await request<ApiResponse<LoginData | string>>('/user/auth/third-party/login', {
			method: 'POST',
			body: data,
		})
		return isSuccessResponse(response) ? extractAuthToken(response) : ''
	} catch {
		return ''
	}
}

export const sendEmailCodeController = async (
	email: string,
	purpose: SendEmailCodePayload['purpose'] = 'user_register',
) => {
	const request = useRequest()
	try {
		const response = await request<ApiResponse<null>>('/user/auth/email/code', {
			method: 'POST',
			body: { email, purpose },
		})

		return isSuccessResponse(response)
	} catch {
		return false
	}
}

export interface RegisterUserResponse {
	token: string
}

export const loginWithEmailController = async (data: EmailLoginPayload) => {
	const request = useRequest()
	try {
		const response = await request<ApiResponse<LoginData | string>>('/user/auth/email/login', {
			method: 'POST',
			body: data,
		})
		return isSuccessResponse(response) ? extractAuthToken(response) : ''
	} catch {
		return ''
	}
}

export const registerUserController = async (data: EmailRegisterPayload) => {
	const request = useRequest()
	try {
		const response = await request<ApiResponse<RegisterUserResponse | LoginData | string>>(
			'/user/auth/email/register',
			{
				method: 'POST',
				body: data,
			},
		)
		return isSuccessResponse(response) ? extractAuthToken(response) : ''
	} catch {
		return ''
	}
}

export const resetPasswordController = async (data: ResetPasswordPayload) => {
	const request = useRequest()
	try {
		const response = await request<ApiResponse<null>>('/user/auth/email/reset-password', {
			method: 'POST',
			body: data,
		})
		return isSuccessResponse(response)
	} catch {
		return false
	}
}
