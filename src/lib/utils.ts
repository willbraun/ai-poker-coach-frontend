import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Hand } from './types'
import { ChangeEvent } from 'react'

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
