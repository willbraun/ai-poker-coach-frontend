import { create } from 'zustand'

interface NewHandStore {
	prompts: Prompt[]
	activePrompt: number
	increment: () => void
	decrement: () => void
}

const initialPrompts: Prompt[] = [
	{
		type: 'name',
		value: '',
	},
	{
		type: 'gameStyle',
		value: 0,
	},
	{
		type: 'playerCount',
		value: 2,
	},
	{
		type: 'position',
		value: 1,
	},
	{
		type: 'smallBlind',
		value: 0,
	},
	{
		type: 'bigBlind',
		value: 0,
	},
	{
		type: 'ante',
		value: 0,
	},
	{
		type: 'bigBlindAnte',
		value: 0,
	},
	{
		type: 'myStack',
		value: 0,
	},
	{
		type: 'notes',
		value: '',
	},
]

export const useNewHandStore = create<NewHandStore>(set => ({
	prompts: initialPrompts,
	activePrompt: 0,
	increment: () => set(state => ({ activePrompt: state.activePrompt + 1 })),
	decrement: () => set(state => ({ activePrompt: state.activePrompt > 0 ? state.activePrompt - 1 : 0 })),
}))
