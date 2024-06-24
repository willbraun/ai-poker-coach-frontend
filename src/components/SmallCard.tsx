import { Card } from '@/lib/types'
import SuitIcon from './SuitIcon'
import { FC } from 'react'

const SmallCard: FC<{ card: Card }> = ({ card }) => {
	return (
		<div className='h-13 flex w-9 flex-col items-center rounded-md border-1 bg-white pb-1 shadow md:h-16 md:w-12 md:pb-16'>
			<p className={`text-md font-bold md:text-2xl ${['D', 'H'].includes(card.suit) && 'text-pure-red'}`}>
				{card.value}
			</p>
			<div className='w-4 md:w-6'>
				<SuitIcon suit={card.suit} />
			</div>
		</div>
	)
}

export default SmallCard
