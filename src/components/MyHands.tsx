import HandPreview from '@/components/HandPreview'
import { getAuthData } from '@/lib/server_utils'
import { Hand } from '@/lib/types'
import Link from 'next/link'
import { FC } from 'react'

const getHands = async (userId: string): Promise<Hand[]> => {
	const res = await fetch(`${process.env.API_URL}/hand?userId=${userId}`)
	return res.json()
}

const MyHands: FC = async () => {
	const { userId } = getAuthData()
	const hands = await getHands(userId)

	return (
		<>
			{hands.map(hand => (
				<HandPreview key={hand.id} hand={hand} />
			))}
			{hands.length === 0 && (
				<div className='mb-auto'>
					<p className='mt-8 text-center text-lg'>
						You have no hands yet. Click{' '}
						<Link href='/new-hand' className='underline'>
							here
						</Link>{' '}
						to add one!
					</p>
				</div>
			)}
		</>
	)
}

export default MyHands
