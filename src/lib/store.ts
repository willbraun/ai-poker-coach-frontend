import { create } from 'zustand'

interface AuthStore {
	isAuth: boolean
	setAuth: (value: boolean) => void
}

export const useAuthStore = create<AuthStore>(set => ({
	isAuth: false,
	setAuth: (value: boolean) => set(() => ({ isAuth: value })),
}))
