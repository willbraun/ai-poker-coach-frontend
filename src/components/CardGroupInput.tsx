import { useFormContext } from 'react-hook-form'
import { FormLabel } from '@/components/ui/form'
import { validRounds } from '@/lib/types'
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

const CardGroup = ({ groupSelector, player }: CardGroupProps) => {
	const { getValues, setValue } = useFormContext()
	const values = getValues()

	// const name = `round${round}Cards`
	const { title, cardCount } = getDetails(groupSelector)
	useEffect(() => {
		setValue(`${groupSelector}.player`, player ?? values.position)
	}, [groupSelector, player, setValue, values.position])

	// watch round, load this once all cards are entered
	// setValue(`${name}.evaluation`, 'test evaluation')

	return (
		<div>
			<FormLabel>{title}</FormLabel>
			<div className='mt-4 flex justify-center gap-4'>
				{Array.from({ length: cardCount }).map((_, i) => (
					<CardInput key={`card_${i}`} cardIndex={i} groupSelector={groupSelector} />
				))}
			</div>
		</div>
	)
}

export default CardGroup
