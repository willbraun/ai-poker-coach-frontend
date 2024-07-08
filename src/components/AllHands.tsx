import HandPreview from '@/components/HandPreview'
import { Hand } from '@/lib/types'
import { FC } from 'react'

const getHands = async (): Promise<Hand[]> => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hand`)
	return res.json()
}

const AllHands: FC = async () => {
	const hands = await getHands()

	return (
		<>
			{hands.map(hand => (
				<HandPreview key={hand.id} hand={hand} />
			))}
		</>
	)
}

export default AllHands
