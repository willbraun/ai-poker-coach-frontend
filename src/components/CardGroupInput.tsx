import { useFormContext } from 'react-hook-form'
import { FormLabel } from '@/components/ui/form'
import { validRounds } from '@/lib/types'
import CardInput from './CardInput'

interface CardGroupProps {
	round: validRounds
	player?: number
}

interface roundDetails {
	title: string
	cardCount: number
}

const getDetails = (round: validRounds, player?: number): roundDetails => {
	switch (round) {
		case 0:
			return {
				title: 'Your cards',
				cardCount: 2,
			}
		case 1:
			return {
				title: 'Flop',
				cardCount: 3,
			}
		case 2:
			return {
				title: 'Turn',
				cardCount: 1,
			}
		case 3:
			return {
				title: 'River',
				cardCount: 1,
			}
		case 4:
			return {
				title: `Player ${player}'s Cards`,
				cardCount: 2,
			}
		default:
			return {
				title: 'Invalid round',
				cardCount: 0,
			}
	}
}

const CardGroup = ({ round, player }: CardGroupProps) => {
	const { getValues, setValue } = useFormContext()
	console.log(getValues())
	const values = getValues()

	const name = `round${round}Cards`
	const { title, cardCount } = getDetails(round)
	setValue(`${name}.player`, player ?? values.position)
	setValue(`${name}.evaluation`, 'test evaluation')

	return (
		<div>
			<FormLabel>{title}</FormLabel>
			<div className='mt-4 flex justify-center gap-4'>
				{Array.from({ length: cardCount }).map((_, i) => (
					<CardInput key={`card_${i}`} cardIndex={i} name={name} />
				))}
			</div>
		</div>
	)
}

export default CardGroup
