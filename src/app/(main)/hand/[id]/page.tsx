import ScrollToTop from '@/components/ScrollToTop'
import SmallCard from '@/components/SmallCard'
import TypographyH1 from '@/components/ui/typography/TypographyH1'
import TypographyH2 from '@/components/ui/typography/TypographyH2'
import { Hand } from '@/lib/types'
import { UUID } from 'crypto'
import { formatDistanceToNow } from 'date-fns'

const getHand = async (id: string): Promise<Hand> => {
	const res = await fetch(`${process.env.API_URL}/hand/${id}`, { next: { revalidate: 60 } })
	return res.json()
}

const decisions = ['folds', 'checks', 'calls', 'bets', 'bets all-in for', 'calls all-in for']

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

	const runningPots = pots.map(_ => 0)
	let activePot = 0

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
			<main className='pt-24 bg-white'>
				<div className='max-w-screen-md mx-auto h-full flex flex-col gap-8 overflow-auto'>
					<section>
						<TypographyH1>{name}</TypographyH1>
						<p className='text-md text-muted-foreground'>{formatDistanceToNow(createdTime, { addSuffix: true })}</p>
					</section>
					<section className='rounded-xl p-4 border-1 border-slate-500'>
						<TypographyH2>Details</TypographyH2>
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
					<section className='[&>*]:p-4 [&>*]:border-b-1 [&>*]:border-slate-300 '>
						<div className='flex items-center gap-8'>
							<p className='text-xl'>You are dealt</p>
							<div className='flex gap-2 pr-4'>
								<SmallCard card={rounds[0].cards[0]} />
								<SmallCard card={rounds[0].cards[1]} />
							</div>
						</div>
						<p className='text-xl'>
							You now have <span className='font-bold'>{rounds[0].evaluation.value}</span>
						</p>
						{rounds[0].actions.map(action => {
							runningPots[activePot] += action.bet
							const betSize = action.decision > 1 ? ` ${action.bet}` : ''
							return (
								<p key={action.step} className='text-xl'>{`Player ${action.player}${
									action.player == position ? ' ⭐️' : ''
								} ${decisions[action.decision]}${betSize}. Pot size is now ${runningPots[activePot]}.`}</p>
							)
						})}
					</section>
				</div>
			</main>
		</>
	)
}

export default HandPage
