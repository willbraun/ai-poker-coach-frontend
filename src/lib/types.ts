interface AuthData {
	userId: string
	accessToken: string
}

export const isAuthData = (value: any): value is AuthData => {
	return Object.keys(value).length === 2 && typeof value.userId === 'string' && typeof value.accessToken === 'string'
}
