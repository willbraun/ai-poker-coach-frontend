import HandPreview from '@/components/HandPreview'
import { Hand } from '@/lib/types'

const getHands = async (): Promise<Hand[]> => {
	const res = await fetch(`${process.env.API_URL}/hand`)
	return res.json()
}

const AllHands = async () => {
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
