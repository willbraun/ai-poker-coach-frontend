import HandPreview from '@/components/HandPreview'
import { getAuthData } from '@/lib/server_utils'
import { Hand } from '@/lib/types'

const getHands = async (userId: string): Promise<Hand[]> => {
	const res = await fetch(`${process.env.API_URL}/hand?userId=${userId}`)
	return res.json()
}

const MyHands = async () => {
	const { userId } = getAuthData()
	const hands = await getHands(userId)

	return (
		<>
			{hands.map(hand => (
				<HandPreview key={hand.id} hand={hand} />
			))}
		</>
	)
}

export default MyHands
