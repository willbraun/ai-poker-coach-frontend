import { create } from 'zustand'

interface AuthStore {
	userId: string
	setUserId: (value: string) => void
}

export const useAuthStore = create<AuthStore>(set => ({
	userId: '',
	setUserId: (value: string) => set(() => ({ userId: value })),
}))
