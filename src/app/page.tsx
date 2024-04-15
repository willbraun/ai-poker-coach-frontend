import HandPreview from '@/components/HandPreview'
import Header from '../components/Header'
import { Hand } from '@/lib/types'

const getHands = async (): Promise<Hand[]> => {
	const res = await fetch(`${process.env.API_URL}/hand`, { next: { revalidate: 1 } })
	return res.json()
}

const Home = async () => {
	const hands = await getHands()

	return (
		<>
			<Header />
			<main className='pt-16 w-full'>
				<div className='max-w-screen-md mx-auto py-2 md:py-4'>
					{hands.map(hand => (
						<HandPreview key={hand.handId} hand={hand} />
					))}
				</div>
			</main>
		</>
	)
}

export default Home
