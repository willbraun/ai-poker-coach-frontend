'use client'

import { useFormContext } from 'react-hook-form'
import { FormLabel } from '@/components/ui/form'
import CardInput from './CardInput'
import { FC, useEffect, useState } from 'react'
import { FormCardGroup, FormRound, PokerEvaluatorCard, Schema } from '@/app/(main)/new-hand/formSchema'

interface CardGroupProps {
	groupSelector: string
	player?: number
	disabled?: boolean
}

interface roundDetails {
	title: string
	cardCount: number
}

interface handEvaluation {
	result: {
		handName: string
		value: number
	}
	error: string
}

export const getDetails = (groupSelector: string, player?: number): roundDetails => {
	if (groupSelector === 'rounds.0.cards') {
		return {
			title: 'Your Cards',
			cardCount: 2,
		}
	} else if (groupSelector === 'rounds.1.cards') {
		return {
			title: 'Flop',
			cardCount: 3,
		}
	} else if (groupSelector === 'rounds.2.cards') {
		return {
			title: 'Turn',
			cardCount: 1,
		}
	} else if (groupSelector === 'rounds.3.cards') {
		return {
			title: 'River',
			cardCount: 1,
		}
	} else if (groupSelector.startsWith('villains') && !!player) {
		return {
			title: `Player ${player}'s Cards`,
			cardCount: 2,
		}
	} else {
		return {
			title: 'Invalid groupSelector',
			cardCount: 0,
		}
	}
}

const evaluateHand = async (cards: PokerEvaluatorCard[]): Promise<handEvaluation> => {
	try {
		const response = await fetch('/api/evaluateHand', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({ cards }),
		})

		if (!response.ok) {
			throw new Error('Error evaluating hand')
		}

		const data: handEvaluation = await response.json()

		return data
	} catch (error) {
		console.error(error)
		return {
			result: {
				handName: '',
				value: 0,
			},
			error: 'Error evaluating hand',
		}
	}
}

const isCardGroupEntered = (cards: ({ value: string; suit: string } | undefined)[], cardCount: number) => {
	const filtered = cards.filter(Boolean)
	return filtered.length === cardCount && filtered.every(card => card?.value && card?.suit)
}

const CardGroup: FC<CardGroupProps> = ({ groupSelector, player, disabled = false }) => {
	const { getValues, setValue, watch } = useFormContext()
	const values = getValues() as Schema
	const { title, cardCount } = getDetails(groupSelector, player)
	const [loading, setLoading] = useState(false)

	const group: FormCardGroup = watch(groupSelector)
	const groupString = JSON.stringify(group?.cards)

	useEffect(() => {
		;(async () => {
			if (isCardGroupEntered(group?.cards, cardCount)) {
				setLoading(true)
				let evalInput: PokerEvaluatorCard[] = []
				if (groupSelector.startsWith('rounds')) {
					const round = parseInt(groupSelector.split('.')[1])
					evalInput = values.rounds.slice(0, round + 1).flatMap((round: FormRound) =>
						round.cards.cards.map(card => {
							return `${card.value}${card.suit}` as PokerEvaluatorCard
						}),
					)
				}

				if (groupSelector.startsWith('villains')) {
					const playerCards = group.cards
					const communityCards = values.rounds.slice(1, 4).flatMap((round: FormRound) => round.cards.cards)
					evalInput = [...playerCards, ...communityCards].map(card => {
						return `${card.value}${card.suit}` as PokerEvaluatorCard
					})
				}

				const evaluation = await evaluateHand(evalInput)

				setValue(`${groupSelector}.evaluation`, evaluation.result.handName)
				setValue(`${groupSelector}.value`, evaluation.result.value ?? 0)
				setLoading(false)
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupString, setValue])

	return (
		<div className={`animate-fadeIn duration-100 ${!disabled && 'rounded-xl border-none bg-accent p-4 shadow-md'}`}>
			<FormLabel>{title}</FormLabel>
			<div className='mb-8 mt-4 flex flex-wrap items-center gap-4'>
				<div className='mr-auto flex gap-4'>
					{Array.from({ length: cardCount }).map((_, i) => (
						<CardInput key={`card_${i}`} cardIndex={i} groupSelector={groupSelector} disabled={disabled} />
					))}
				</div>
				{!group?.evaluation && loading ? <p>Loading...</p> : <p>{group.evaluation ?? ''}</p>}
			</div>
		</div>
	)
}

export default CardGroup
