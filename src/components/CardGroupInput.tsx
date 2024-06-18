import { useFormContext } from 'react-hook-form'
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import CardInput from './CardInput'
import { useEffect } from 'react'
import { FormCardGroup, FormRound, PokerEvaluatorCard, Schema } from '@/app/(main)/new-hand/formSchema'
import { handleNumberChange, handleNumberBlur, isZeroBet } from '@/lib/utils'
import { Input } from 'postcss'

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

const CardGroup = ({ groupSelector, player, disabled = false }: CardGroupProps) => {
	const { getValues, setValue, watch } = useFormContext()
	const values = getValues() as Schema
	const { title, cardCount } = getDetails(groupSelector, player)

	const group: FormCardGroup = watch(groupSelector)
	const groupString = JSON.stringify(group?.cards)

	useEffect(() => {
		;(async () => {
			if (isCardGroupEntered(group?.cards, cardCount)) {
				let evalInput: PokerEvaluatorCard[] = []
				if (groupSelector.startsWith('rounds')) {
					const round = parseInt(groupSelector.split('.')[1])
					evalInput = values.rounds.slice(0, round + 1).flatMap((round: FormRound) =>
						round.cards.cards.map(card => {
							return `${card.value}${card.suit}` as PokerEvaluatorCard
						})
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
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [groupString, setValue])

	return (
		<div className={`duration-100 ${!disabled && 'bg-blue-200 scale-105 rounded-xl p-4 border-1 border-black'}`}>
			<FormLabel>{title}</FormLabel>
			<div className='mt-4 mb-8 flex flex-wrap items-center gap-4'>
				<div className='flex gap-4 mr-auto'>
					{Array.from({ length: cardCount }).map((_, i) => (
						<CardInput key={`card_${i}`} cardIndex={i} groupSelector={groupSelector} disabled={disabled} />
					))}
				</div>
				<p className=''>{group?.evaluation ?? ''}</p>
			</div>
		</div>
	)
}

export default CardGroup
