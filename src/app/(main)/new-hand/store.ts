import { create } from 'zustand'

interface NewHandStore {
	prompts: Prompt[]
	activePrompt: number
	increment: () => void
	decrement: () => void
}

const initialPrompts: Prompt[] = [
	{
		index: 0,
		type: 'name',
		value: '',
	},
	{
		index: 1,
		type: 'gameStyle',
		value: 0,
	},
	{
		index: 2,
		type: 'playerCount',
		value: 0,
	},
	{
		index: 3,
		type: 'position',
		value: 0,
	},
	{
		index: 4,
		type: 'smallBlind',
		value: 0,
	},
	{
		index: 5,
		type: 'bigBlind',
		value: 0,
	},
	{
		index: 6,
		type: 'ante',
		value: 0,
	},
	{
		index: 7,
		type: 'bigBlindAnte',
		value: 0,
	},
	{
		index: 8,
		type: 'myStack',
		value: 0,
	},
	{
		index: 9,
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
