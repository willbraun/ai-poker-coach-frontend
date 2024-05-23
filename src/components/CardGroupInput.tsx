import { useFormContext } from 'react-hook-form'
import { FormLabel } from '@/components/ui/form'
import CardInput from './CardInput'
import { useEffect } from 'react'
import { FormRound } from '@/app/(main)/new-hand/page'

interface CardGroupProps {
	groupSelector: string
	player?: number
}

interface roundDetails {
	title: string
	cardCount: number
}

const getDetails = (groupSelector: string, player?: number): roundDetails => {
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

const evaluateHand = async (cards: string[]) => {
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
		return data.result
	} catch (error) {
		console.error(error)
		return 'error'
	}
}

export const isCardGroupComplete = (cards: { value: string; suit: string }[], cardCount: number) => {
	return cards.length === cardCount && cards.every(card => card?.value && card?.suit)
}

const CardGroup = ({ groupSelector, player }: CardGroupProps) => {
	const { getValues, setValue, watch } = useFormContext()
	const values = getValues()
	const { title, cardCount } = getDetails(groupSelector, player)

	const group = watch(groupSelector)

	useEffect(() => {
		;(async () => {
			if (isCardGroupComplete(group?.cards, cardCount)) {
				let evalInput: string[] = []
				if (groupSelector.startsWith('rounds')) {
					const round = parseInt(groupSelector.split('.')[1])
					evalInput = values.rounds.slice(0, round + 1).flatMap((round: FormRound) =>
						round.cards.cards.map(card => {
							return `${card.value}${card.suit}`
						})
					)
				}

				const evaluation = await evaluateHand(evalInput)

				setValue(`${groupSelector}.evaluation`, evaluation.handName)
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(group?.cards)])

	return (
		<div>
			<FormLabel>{title}</FormLabel>
			<div className='mt-4 mb-8 flex flex-wrap items-center gap-4'>
				<div className='flex gap-4 mr-auto'>
					{Array.from({ length: cardCount }).map((_, i) => (
						<CardInput key={`card_${i}`} cardIndex={i} groupSelector={groupSelector} />
					))}
				</div>
				<p className=''>{group?.evaluation ?? ''}</p>
			</div>
		</div>
	)
}

export default CardGroup
