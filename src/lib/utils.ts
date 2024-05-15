import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Hand } from './types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getIsWin = (hand: Hand): boolean => {
	return hand.handSteps.pots.some(pot => pot.winner.split(',').includes(hand.handSteps.position.toString()))
}

export const valueToDisplay: Record<string, string> = {
	'2': '2',
	'3': '3',
	'4': '4',
	'5': '5',
	'6': '6',
	'7': '7',
	'8': '8',
	'9': '9',
	T: '10',
	J: 'Jack',
	Q: 'Queen',
	K: 'King',
	A: 'Ace',
}
