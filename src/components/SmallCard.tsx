import { Card } from '@/lib/types'
import { suitMap } from '@/lib/utils'
import Image from 'next/image'

const SmallCard = ({ card }: { card: Card }) => {
	return (
		<div className='w-9 h-13 md:w-12 md:h-16 rounded-md border-1 border-gray-300 flex flex-col items-center shadow'>
			<p className={`text-md md:text-2xl font-bold ${['D', 'H'].includes(card.suit) && 'text-pure-red'}`}>
				{card.value}
			</p>
			<Image
				src={require(`@/lib/images/icons/${suitMap[card.suit]}.svg`).default}
				alt={'spade'}
				className='scale-75 md:scale-100'
			/>
		</div>
	)
}

export default SmallCard
