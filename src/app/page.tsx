import { Suspense } from 'react'
import HandPreview from '@/components/HandPreview'
import Header from '../components/Header'
import { Hand } from '@/lib/types'

const getHands = async (): Promise<Hand[]> => {
	const res = await fetch(`${process.env.API_URL}/hand`, { next: { revalidate: 60 } })
	return res.json()
}

const Home = async () => {
	const hands = await getHands()

	return (
		<>
			<Header />
			<main className='mt-14 w-full bg-slate-100'>
				<div className='max-w-screen-md mx-auto p-4'>
					{hands.map(hand => (
						<HandPreview key={hand.handId} hand={hand} />
					))}
				</div>
			</main>
		</>
	)
}

export default Home
