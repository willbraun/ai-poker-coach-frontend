import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Hand } from './types'
import { ChangeEvent } from 'react'
import Cookies from 'js-cookie'
import { FormAction, FormCardValue } from '@/app/(main)/new-hand/formSchema'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getIsWin = (hand: Hand): boolean => {
	return hand.handSteps.pots.some(pot => pot.winner.split(',').includes(hand.handSteps.position.toString()))
}

export const valueToDisplay: Record<FormCardValue, string> = {
	'2': 'Two',
	'3': 'Three',
	'4': 'Four',
	'5': 'Five',
	'6': 'Six',
	'7': 'Seven',
	'8': 'Eight',
	'9': 'Nine',
	T: 'Ten',
	J: 'Jack',
	Q: 'Queen',
	K: 'King',
	A: 'Ace',
}

export const suitToDisplay: Record<string, string> = {
	C: 'Clubs',
	D: 'Diamonds',
	H: 'Hearts',
	S: 'Spades',
}

export const isZeroBet = (decision: string) => ['', 'fold', 'check'].includes(decision)

export const handleNumberChange = (event: ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
	const inputValue = event.target.value
	const regex = /^\d*\.?\d*$/ // Regular expression to match numbers and decimals

	if (regex.test(inputValue) || inputValue === '') {
		onChange(inputValue)
	}
}

export const handleNumberBlur = (event: ChangeEvent<HTMLInputElement>, onBlur: (value: string) => void) => {
	// Remove leading zeros only if not followed by a decimal point
	const trimmedValue = event.target.value.replace(/^0+(?!\.)/, '') || '0'

	if (trimmedValue.split('.')[1]?.length > 2) {
		const roundedValue = parseFloat(trimmedValue).toFixed(2)
		onBlur(roundedValue)
	} else {
		onBlur(trimmedValue)
	}
}

export const getPlayersBettingFull = (actions: FormAction[]) => {
	const playersThisRound = new Set(actions.map(action => action.player))
	const playersNotBettingFull = new Set<number>()
	actions.forEach(({ player, decision }) => {
		if (decision === 'fold' || decision === 'callAllIn') {
			playersNotBettingFull.add(player)
		}
	})
	const playersBettingFull = new Set<number>()
	playersThisRound.forEach(player => {
		if (!playersNotBettingFull.has(player)) {
			playersBettingFull.add(player)
		}
	})
	return Array.from(playersBettingFull)
}

export const getPlayerBetSums = (players: number[], actions: FormAction[]) => {
	return players.map(player => {
		return actions
			.filter(action => action.player === player)
			.map(action => Number(action.bet))
			.reduce((a, b) => a + b, 0)
	})
}

export const getAuthDataClient = () => {
	const authCookie = Cookies.get('auth')
	console.log(authCookie)
	if (!authCookie) {
		return {}
	}

	return JSON.parse(authCookie)
}

export const revalidateAllClient = async () => {
	const response = await fetch(`/api/revalidateAll`, {
		method: 'POST',
	})
	const data = await response.json()
	if (data.error) {
		console.error(data)
	}
}
