import { useFormContext } from 'react-hook-form'
import { FormLabel } from '@/components/ui/form'
import CardInput from './CardInput'
import { useEffect } from 'react'
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

const evaluateHand = async (cards: PokerEvaluatorCard[]): Promise<string> => {
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

		const data = await response.json()
		return data.result.handName
	} catch (error) {
		console.error(error)
		return `Error: ${error}`
	}
}

export const isCardGroupComplete = (cards: { value: string; suit: string }[], cardCount: number) => {
	return cards.length === cardCount && cards.every(card => card?.value && card?.suit)
}

const CardGroup = ({ groupSelector, player, disabled = false }: CardGroupProps) => {
	const { getValues, setValue, watch } = useFormContext()
	const values = getValues() as Schema
	const { title, cardCount } = getDetails(groupSelector, player)

	const group: FormCardGroup = watch(groupSelector)

	useEffect(() => {
		;(async () => {
			if (isCardGroupComplete(group?.cards, cardCount)) {
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

				setValue(`${groupSelector}.evaluation`, evaluation)
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(group?.cards)])

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
