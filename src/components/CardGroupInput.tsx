import { useFormContext } from 'react-hook-form'
import { FormLabel } from '@/components/ui/form'
import CardInput from './CardInput'
import { useEffect } from 'react'

interface CardGroupProps {
	groupSelector: string
	player?: number
}

interface roundDetails {
	title: string
	cardCount: number
}

const getDetails = (groupSelector: string, player?: number): roundDetails => {
	if (groupSelector === 'round0Cards') {
		return {
			title: 'Your cards',
			cardCount: 2,
		}
	} else if (groupSelector === 'round1Cards') {
		return {
			title: 'Flop',
			cardCount: 3,
		}
	} else if (groupSelector === 'round2Cards') {
		return {
			title: 'Turn',
			cardCount: 1,
		}
	} else if (groupSelector === 'round3Cards') {
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

const CardGroup = ({ groupSelector, player }: CardGroupProps) => {
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
				const evalInput: string[] = Object.entries(values)
					.filter(([key, _]) => key.startsWith('round') && key.endsWith('Cards'))
					.flatMap(([_, group]) =>
						group.cards.map((card: { value: string; suit: string }) => {
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
			<div className='mt-4 flex items-center gap-4'>
				{Array.from({ length: cardCount }).map((_, i) => (
					<CardInput key={`card_${i}`} cardIndex={i} groupSelector={groupSelector} />
				))}
				<p className='ml-auto'>{group.evaluation}</p>
			</div>
		</div>
	)
}

export default CardGroup
