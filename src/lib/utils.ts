import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Hand } from './types'

export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs))
}

export const getIsWin = (hand: Hand): boolean => {
	return hand.handSteps.pots.some(pot => pot.winner.split(',').includes(hand.handSteps.position.toString()))
}
