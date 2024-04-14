import { Card } from '@/lib/types'

const SmallCard = ({ card }: { card: Card }) => {
	return (
		<div className='w-10 h-16 rounded-md border-1 border-gray-300 flex flex-col justify-center items-center shadow'>
			<p className='text-xl font-bold'>{card.value}</p>
			<p>{card.suit}</p>
		</div>
	)
}

export default SmallCard
