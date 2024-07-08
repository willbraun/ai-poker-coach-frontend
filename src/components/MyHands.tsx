import HandPreview from '@/components/HandPreview'
import { getAuthData } from '@/lib/server_utils'
import { Hand } from '@/lib/types'
import Link from 'next/link'
import { FC } from 'react'

const getHands = async (userId: string): Promise<Hand[]> => {
	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hand?userId=${userId}`)
	return res.json()
}

const MyHands: FC = async () => {
	const { userId } = getAuthData()
	const hands = await getHands(userId)

	if (!userId) {
		return <p>{`Invalid user ID: ${userId}`}</p>
	}

	return (
		<>
			{hands.map(hand => (
				<HandPreview key={hand.id} hand={hand} />
			))}
			{hands.length === 0 && (
				<p className='mt-8 text-center text-lg'>
					You have no hands yet. Click{' '}
					<Link href='/new-hand' className='underline'>
						here
					</Link>{' '}
					to add one!
				</p>
			)}
		</>
	)
}

export default MyHands
