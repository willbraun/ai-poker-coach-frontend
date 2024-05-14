import { Card } from '@/lib/types'
import SuitIcon from './SuitIcon'

const SmallCard = ({ card }: { card: Card }) => {
	return (
		<div className='w-9 h-13 md:w-12 md:h-16 rounded-md border-1 border-gray-300 flex flex-col items-center shadow'>
			<p className={`text-md md:text-2xl font-bold ${['D', 'H'].includes(card.suit) && 'text-pure-red'}`}>
				{card.value}
			</p>
			<div className='scale-75 md:scale-100'>
				<SuitIcon suit={card.suit} />
			</div>
		</div>
	)
}

export default SmallCard
