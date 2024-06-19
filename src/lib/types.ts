import { UUID } from 'crypto'

export interface AuthData {
	userId: string
	accessToken: string
	expiresIn: number
	refreshToken: string
}

export const isAuthData = (value: any): value is AuthData => {
	return (
		Object.keys(value).length === 4 &&
		typeof value.userId === 'string' &&
		typeof value.accessToken === 'string' &&
		typeof value.expiresIn === 'number' &&
		typeof value.refreshToken === 'string'
	)
}

export interface Hand {
	id: UUID
	applicationUserId: UUID
	handSteps: HandSteps
	analysis: string
	createdTime: Date
}

export const isHand = (value: any): value is Hand => {
	return (
		Object.keys(value).length === 5 &&
		typeof value.id === 'string' &&
		typeof value.applicationUserId === 'string' &&
		typeof value.analysis === 'string' &&
		value.createdTime instanceof Date
	)
}

export interface HandSteps {
	name: string
	gameStyle: number
	playerCount: number
	position: number
	smallBlind: number
	bigBlind: number
	ante: number
	bigBlindAnte: number
	myStack: number
	notes: string
	pots: Pot[]
	rounds: Round[]
	villains: Villain[]
}

export interface Pot {
	potIndex: number
	winner: string
}

export interface Round {
	cards: Card[]
	evaluation: Evaluation
	actions: Action[]
	potActions: PotAction[]
}

export interface Villain {
	cards: Card[]
	evaluation: Evaluation
}

export interface Card {
	step: number
	player: number
	value: string
	suit: string
}

export interface Evaluation {
	step: number
	player: number
	value: string
}

export interface Action {
	step: number
	player: number
	decision: number
	bet: number
}

export interface PotAction {
	step: number
	player: number
	potIndex: number
	bet: number
}

export type validRound = -1 | 0 | 1 | 2 | 3

export type ActionSelector = `rounds.${validRound}.actions`

export type SinglePlayerStatus = 'current' | 'active' | 'all-in' | 'folded'

export interface PlayerStatus {
	[player: number]: SinglePlayerStatus
}

export interface AnalysisData {
	analysis: string
}

export const isAnalysisData = (value: any): value is AnalysisData => {
	return Object.keys(value).length === 1 && typeof value.analysis === 'string'
}
