import HandPreview from '@/components/HandPreview'
import { AuthData, Hand } from '@/lib/types'
import { cookies } from 'next/headers'

const getHands = async (userId: string): Promise<Hand[]> => {
	const res = await fetch(`${process.env.API_URL}/hand?userId=${userId}`, { next: { revalidate: 60 } })
	return res.json()
}

const MyHands = async () => {
  const authCookie = cookies().get('auth')?.value ?? '{}'
  const parsed: AuthData = JSON.parse(authCookie)
	const hands = await getHands(parsed.userId)

	return (
		<>
			{hands.map(hand => (
				<HandPreview key={hand.handId} hand={hand} />
			))}
		</>
	)
}

export default MyHands
