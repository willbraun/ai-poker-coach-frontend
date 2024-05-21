import { UUID } from 'crypto'

export interface AuthData {
	userId: string
	accessToken: string
}

export const isAuthData = (value: any): value is AuthData => {
	return Object.keys(value).length === 2 && typeof value.userId === 'string' && typeof value.accessToken === 'string'
}

export interface Hand {
	id: UUID
	applicationUserId: string
	handSteps: HandSteps
	analysis: string
	createdTime: Date
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

export type validRound = 0 | 1 | 2 | 3

export type ActionSelector = `rounds.${validRound}.actions`

export type PlayerStatus = 'current' | 'active' | 'all-in' | 'folded'
