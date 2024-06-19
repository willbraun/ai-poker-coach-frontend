import { Card } from '@/lib/types'
import SuitIcon from './SuitIcon'
import { FC } from 'react'

const SmallCard: FC<{ card: Card }> = ({ card }) => {
	return (
		<div className='w-9 h-13 md:w-12 md:h-16 rounded-md pb-1 md:pb-16 border-1 border-gray-300 flex flex-col items-center shadow'>
			<p className={`text-md md:text-2xl font-bold ${['D', 'H'].includes(card.suit) && 'text-pure-red'}`}>
				{card.value}
			</p>
			<div className='w-4 md:w-6'>
				<SuitIcon suit={card.suit} />
			</div>
		</div>
	)
}

export default SmallCard
