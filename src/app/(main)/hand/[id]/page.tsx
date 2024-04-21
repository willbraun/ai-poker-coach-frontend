import Analysis from '@/components/Analysis'
import ScrollToTop from '@/components/ScrollToTop'
import SmallCard from '@/components/SmallCard'
import TypographyH1 from '@/components/ui/typography/TypographyH1'
import TypographyH2 from '@/components/ui/typography/TypographyH2'
import { Action, Card, Hand, Pot, Round } from '@/lib/types'
import { getIsWin } from '@/lib/utils'
import { UUID } from 'crypto'
import { formatDistanceToNow } from 'date-fns'

const getHand = async (id: string): Promise<Hand> => {
	const res = await fetch(`${process.env.API_URL}/hand/${id}`, { next: { revalidate: 60 } })
	return res.json()
}

const decisions = ['folds', 'checks', 'calls', 'bets', 'bets all-in for', 'calls all-in for']

const potColors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-orange-200', 'bg-pink-200', 'bg-purple-200']

const roundText = [
	{
		cards: 'You are dealt',
		pots: 'Pots after preflop betting',
	},
	{
		cards: 'Flop',
		pots: 'Pots after flop betting',
	},
	{
		cards: 'Turn',
		pots: 'Pots after turn betting',
	},
	{
		cards: 'River',
		pots: 'Pots after river betting',
	},
]

const getPositionMessage = (position: number, playerCount: number) => {
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

const getPotActionSums = (pots: Pot[], round: Round): number[] => {
	return round.potActions.reduce((acc, i) => {
		acc[i.potIndex] += i.bet
		return acc
	}, Array(pots.length).fill(0))
}

const getCumulativePotActionSum = (pots: Pot[], rounds: Round[], roundIndex: number): number[] => {
	return rounds
		.map(round => getPotActionSums(pots, round))
		.slice(0, roundIndex + 1)
		.reduce((acc, i) => {
			return acc.map((value, index) => value + i[index])
		}, Array(pots.length).fill(0))
}

const CardLine = ({
	message,
	hole,
	table,
	evaluation,
}: {
	message: string
	hole: [Card, Card]
	table?: Card[]
	evaluation: string
}) => {
	return (
		<div className='flex items-center'>
			<p className='text-xl pr-8'>{message}</p>
			<div className='flex gap-2 pr-4'>
				<SmallCard card={hole[0]} />
				<SmallCard card={hole[1]} />
			</div>
			{table ? (
				<div className='flex gap-2 pl-4 border-l-2 border-black'>
					{table?.map(card => (
						<SmallCard key={card.step} card={card} />
					))}
				</div>
			) : null}
			<p className='text-muted-foreground ml-auto pl-4 text-right'>{evaluation}</p>
		</div>
	)
}

const ActionLine = ({ action, position }: { action: Action; position: number }) => {
	const betSize = action.decision > 1 ? ` ${action.bet}` : ''
	return (
		<div className='flex'>
			<p key={action.step} className='text-xl'>{`Player ${action.player}${action.player == position ? ' ⭐️' : ''} ${
				decisions[action.decision]
			}${betSize}.`}</p>
		</div>
	)
}

const PotView = ({ value, index }: { value: number; index: number }) => {
	return <div className={`px-2 py-1 rounded text-xl ${potColors[index]}`}>{value}</div>
}

const PotLine = ({ message, potStatus }: { message: string; potStatus: number[] }) => {
	return (
		<div className='flex items-center gap-4'>
			<p className='text-xl'>{message}</p>
			{potStatus
				.filter(potStatus => potStatus > 0)
				.map((potStatus, i) => (
					<PotView key={crypto.randomUUID()} value={potStatus} index={i} />
				))}
		</div>
	)
}

const RoundDetails = ({
	rounds,
	index,
	position,
	potStatus,
}: {
	rounds: Round[]
	index: number
	position: number
	potStatus: number[]
}) => {
	const tableCards = rounds
		.slice(1, index + 1)
		.flatMap(round => round.cards)
		.filter(card => card.player === 0)

	return (
		<>
			<CardLine
				message={roundText[index].cards}
				hole={[rounds[0].cards[0], rounds[0].cards[1]]}
				table={tableCards}
				evaluation={rounds[index].evaluation.value}
			/>
			{rounds[index].actions.map(action => {
				return <ActionLine key={action.step} action={action} position={position} />
			})}
			<PotLine message={roundText[index].pots} potStatus={potStatus} />
		</>
	)
}

const HandPage = async ({ params }: { params: { id: UUID } }) => {
	const hand = await getHand(params.id)
	const { handSteps, analysis, createdTime } = hand
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

	const potStatusByRound = rounds.map((_, i) => getCumulativePotActionSum(pots, rounds, i))

	const isWin = getIsWin(hand)
	const loss = rounds
		.flatMap(round => round.actions.filter(action => action.player === position).map(action => action.bet))
		.reduce((acc, i) => acc + i, 0)

	return (
		<>
			<ScrollToTop />
			<main className='pt-24 pb-16 bg-white'>
				<div className='max-w-screen-md mx-auto h-full flex flex-col gap-8 p-4'>
					<section>
						<TypographyH1>{name}</TypographyH1>
						<p className='text-md text-muted-foreground'>{formatDistanceToNow(createdTime, { addSuffix: true })}</p>
					</section>
					<section className='rounded-xl p-4 border-1 border-slate-300'>
						<TypographyH2>Details</TypographyH2>
						<p>{['Tournament', 'Cash Game'][gameStyle]}</p>
						<p>{playerCount} Players</p>
						<p>{getPositionMessage(position, playerCount)}</p>
						<p>
							Blinds: {smallBlind}/{bigBlind}
						</p>
						{ante ? <p>Ante: {ante}</p> : null}
						{bigBlindAnte ? <p>Big Blind Ante: {bigBlindAnte}</p> : null}
						<p>Stack: {myStack}</p>
						<p className='mt-4'>
							Notes: <span>{notes}</span>
						</p>
					</section>
					<section className='[&>*]:p-4 [&>*]:border-b-1 [&>*]:border-slate-300 '>
						{ante || bigBlindAnte ? (
							<div className='flex items-center'>
								<p className='text-xl'>Pot after antes</p>
								<PotView value={ante + bigBlindAnte * playerCount} index={0} />
							</div>
						) : null}
						{rounds.map((round, i) => (
							<RoundDetails
								key={round.cards[0].step}
								rounds={rounds}
								index={i}
								position={position}
								potStatus={potStatusByRound[i]}
							/>
						))}
						{villains.length
							? villains.map(villain => {
									return (
										<CardLine
											key={villain.cards[0].step}
											message={`Player ${villain.cards[0].player} shows down`}
											hole={[villain.cards[0], villain.cards[1]]}
											evaluation={villain.evaluation.value}
										/>
									)
							  })
							: null}
						{pots.map(pot => {
							if (pot.winner.length === 1) {
								return (
									<div key={crypto.randomUUID()} className='flex items-center gap-4'>
										<p className='text-xl'>Player {pot.winner} wins</p>
										<PotView
											key={crypto.randomUUID()}
											value={potStatusByRound.at(-1)![pot.potIndex]}
											index={pot.potIndex}
										/>
									</div>
								)
							} else {
								const winners = pot.winner.split(',')
								return (
									<>
										{winners.map(winner => {
											return (
												<div key={crypto.randomUUID()} className='flex items-center gap-4'>
													<p className='text-xl'>Player {winner} wins</p>
													<PotView
														key={crypto.randomUUID()}
														value={potStatusByRound.at(-1)![pot.potIndex] / winners.length}
														index={pot.potIndex}
													/>
												</div>
											)
										})}
									</>
								)
							}
						})}
						{!isWin ? (
							<div className='text-xl flex items-center gap-4'>
								<p>You lost</p>
								<p className='px-2 py-1 bg-red-300 rounded'>{loss}</p>
							</div>
						) : null}
					</section>
					<section>
						<TypographyH2>Analysis</TypographyH2>
						<Analysis analysis={analysis} />
					</section>
				</div>
			</main>
		</>
	)
}

export default HandPage
