import { useFormContext } from 'react-hook-form'
import { FormLabel } from '@/components/ui/form'
import CardInput from './CardInput'
import { useEffect } from 'react'
import { FormRound } from '@/app/(main)/new-hand/page'

interface CardGroupProps {
	groupSelector: string
}

interface roundDetails {
	title: string
	cardCount: number
}

const getDetails = (groupSelector: string, player?: number): roundDetails => {
	if (groupSelector === 'rounds.0.cards') {
		return {
			title: 'Your cards',
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

const CardGroup = ({ groupSelector }: CardGroupProps) => {
	const { getValues, setValue, watch } = useFormContext()
	const values = getValues()
	const { title, cardCount } = getDetails(groupSelector)

	const group = watch(groupSelector)

	useEffect(() => {
		;(async () => {
			if (
				group?.cards.length === cardCount &&
				group?.cards.every((card: { value: string; suit: string }) => card?.value && card?.suit)
			) {
				const evalInput: string[] = values.rounds.flatMap((round: FormRound) =>
					round.cards.cards.map(card => {
						return `${card.value}${card.suit}`
					})
				)
				const evaluation = await evaluateHand(evalInput)

				setValue(`${groupSelector}.evaluation`, evaluation.handName)
			}
		})()
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [JSON.stringify(group?.cards)])

	return (
		<div>
			<FormLabel>{title}</FormLabel>
			<div className='mt-4 mb-8 flex items-center gap-4'>
				{Array.from({ length: cardCount }).map((_, i) => (
					<CardInput key={`card_${i}`} cardIndex={i} groupSelector={groupSelector} />
				))}
				<p className='ml-auto'>{group.evaluation}</p>
			</div>
		</div>
	)
}

export default CardGroup
