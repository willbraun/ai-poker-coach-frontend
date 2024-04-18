import ScrollToTop from '@/components/ScrollToTop'
import { Hand } from '@/lib/types'
import { UUID } from 'crypto'
import { formatDistanceToNow } from 'date-fns'

const getHand = async (id: string): Promise<Hand> => {
	const res = await fetch(`${process.env.API_URL}/hand/${id}`, { next: { revalidate: 60 } })
	return res.json()
}

const HandPage = async ({ params }: { params: { id: UUID } }) => {
	const { handSteps, analysis, createdTime } = await getHand(params.id)
	const {
		name,
		gameStyle,
		playerCount,
		position,
		smallBlind,
		bigBlind,
		ante,
		bigBlindAnte,
		myStack,
		notes,
		pots,
		rounds,
		villains,
	} = handSteps

	const getPositionMessage = () => {
		if (position === 1) {
			return 'You are the small blind (position 1)'
		} else if (position === 2) {
			return 'You are the big blind (position 2)'
		} else if (position === playerCount) {
			return `You are on the button (position ${position})`
		} else if (position === playerCount - 1) {
			return `You are the cutoff (position ${position})`
		} else {
			return `You are position ${position} relative to the small blind (1)`
		}
	}

	return (
		<>
			<ScrollToTop />
			<main className='mt-32 max-w-screen-md mx-auto flex flex-col gap-8'>
				<section>
					<h1 className='scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl'>{name}</h1>
					<p className='text-md text-muted-foreground'>{formatDistanceToNow(createdTime, { addSuffix: true })}</p>
				</section>
				<section className='rounded-xl p-4 bg-white shadow'>
					<h2 className='scroll-m-20 pb-2 text-3xl font-semibold tracking-tight'>Details</h2>
					<p>{['Tournament', 'Cash Game'][gameStyle]}</p>
					<p>{playerCount} Players</p>
					<p>{getPositionMessage()}</p>
					<p>
						Blinds: {smallBlind}/{bigBlind}
					</p>
					{ante ? <p>Ante: {ante}</p> : <></>}
					{bigBlindAnte ? <p>Big Blind Ante: {bigBlindAnte}</p> : <></>}
					<p>Stack: {myStack}</p>
					<p className='mt-4'>
						Notes: <span>{notes}</span>
					</p>
				</section>
			</main>
		</>
	)
}

export default HandPage
