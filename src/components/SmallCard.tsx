import { Card } from '@/lib/types'
import Image from 'next/image'
import club from '@/lib/images/icons/club.svg'
import diamond from '@/lib/images/icons/diamond.svg'
import heart from '@/lib/images/icons/heart.svg'
import spade from '@/lib/images/icons/spade.svg'

const suitMap: Record<string, JSX.Element> = {
	C: <Image src={club} alt={'club'} className='scale-75 md:scale-100' />,
	D: <Image src={diamond} alt={'diamond'} className='scale-75 md:scale-100' />,
	H: <Image src={heart} alt={'heart'} className='scale-75 md:scale-100' />,
	S: <Image src={spade} alt={'spade'} className='scale-75 md:scale-100' />,
}

const SmallCard = ({ card }: { card: Card }) => {
	return (
		<div className='w-9 h-13 md:w-12 md:h-16 rounded-md border-1 border-gray-300 flex flex-col items-center shadow'>
			<p className={`text-md md:text-2xl font-bold ${['D', 'H'].includes(card.suit) && 'text-pure-red'}`}>
				{card.value}
			</p>
			{suitMap[card.suit]}
		</div>
	)
}

export default SmallCard
