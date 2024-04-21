import { Card } from '@/lib/types'
import { suitMap } from '@/lib/utils'
import Image from 'next/image'

const valueMap: Record<string, string> = {
	'2': '2',
	'3': '3',
	'4': '4',
	'5': '5',
	'6': '6',
	'7': '7',
	'8': '8',
	'9': '9',
	T: '10',
	J: 'jack',
	Q: 'queen',
	K: 'king',
	A: 'ace',
}

const LargeCard = ({ card }: { card: Card }) => {
	return (
		<Image
			src={require(`@/lib/images/svg_playing_cards/${suitMap[card.suit]}s_${valueMap[card.value]}.svg`).default}
			alt={'spade'}
			className='scale-75 md:scale-100'
			width={100}
		/>
	)
}

export default LargeCard
