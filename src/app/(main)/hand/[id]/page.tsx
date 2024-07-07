import Analysis from '@/components/Analysis'
import ScrollToTop from '@/components/ScrollToTop'
import SmallCard from '@/components/SmallCard'
import { Button } from '@/components/ui/button'
import TypographyH1 from '@/components/ui/typography/TypographyH1'
import TypographyH2 from '@/components/ui/typography/TypographyH2'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'
import { Action, Card as CardType, ErrorMessage, Hand, isErrorMessage, Pot, Round } from '@/lib/types'
import { getIsWin } from '@/lib/utils'
import { UUID } from 'crypto'
import { formatDistanceToNow } from 'date-fns'
import DeleteHandDialogContent from './DeleteHandDialogContent'
import { getAuthData } from '@/lib/server_utils'
import { FC } from 'react'

const getHand = async (id: string): Promise<Hand | ErrorMessage> => {
	const res = await fetch(`${process.env.API_URL}/hand/${id}`, { next: { revalidate: 60 } })
	return res.json()
}

const decisions = ['folds', 'checks', 'calls', 'bets', 'raises to', 'bets all-in for', 'calls all-in for']
const myDecisions = ['fold', 'check', 'call', 'bet', 'raise to', 'bet all-in for', 'call all-in for']

const potColors = ['bg-blue-200', 'bg-green-200', 'bg-yellow-200', 'bg-orange-200', 'bg-pink-200', 'bg-purple-200']

const roundText = [
	{
		cards: 'I am dealt',
		pots: 'preflop betting',
	},
	{
		cards: 'Flop',
		pots: 'flop betting',
	},
	{
		cards: 'Turn',
		pots: 'turn betting',
	},
	{
		cards: 'River',
		pots: 'river betting',
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
	hole: [CardType, CardType]
	table?: CardType[]
	evaluation: string
}) => {
	return (
		<div className='flex flex-wrap items-center gap-y-2'>
			<div className='mr-auto flex flex-wrap items-center gap-y-2'>
				<p className='pr-4 text-xl md:pr-8'>{message}</p>
				<div className='flex gap-2 pr-4'>
					<SmallCard card={hole[0]} />
					<SmallCard card={hole[1]} />
				</div>
				{table ? (
					<div className='flex gap-2 border-l-2 border-black pl-4'>
						{table.map(card => (
							<SmallCard key={card.step} card={card} />
						))}
					</div>
				) : null}
			</div>
			<p className='text-muted-foreground'>{evaluation}</p>
		</div>
	)
}

const ActionLine = ({ action, position }: { action: Action; position: number }) => {
	let message = ''
	if (action.player === position) {
		message = `I ${myDecisions[action.decision]}`
	} else {
		message = `Player ${action.player} ${decisions[action.decision]}`
	}

	const betSize = action.decision > 1 ? ` ${action.bet}` : ''
	return (
		<div className='flex'>
			<p key={action.step} className='text-xl'>{`${message}${betSize}`}</p>
		</div>
	)
}

const PotView = ({ value, index }: { value: number; index: number }) => {
	return <div className={`rounded px-2 py-1 text-xl ${potColors[index]}`}>{value}</div>
}

const PotLine = ({ message, potStatus }: { message: string; potStatus: number[] }) => {
	const pots = potStatus.filter(potStatus => potStatus > 0)

	return (
		<div className='flex items-center gap-4'>
			<p className='text-xl'>{`Pot${pots.length > 1 ? 's' : ''} after ${message}`}</p>
			{pots.map((pot, i) => (
				<PotView key={i} value={pot} index={i} />
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

const HandPage: FC<{ params: { id: UUID } }> = async ({ params }) => {
	const { userId } = getAuthData()

	const hand = await getHand(params.id)

	if (isErrorMessage(hand)) {
		return (
			<main className='flex h-full w-full flex-col items-center justify-center p-8'>
				<p className='mb-8 text-3xl'>Error: {hand.message}</p>
			</main>
		)
	}

	const { handSteps, analysis, createdTime, applicationUserId } = hand
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
			<main className='pt-16 lg:pb-16 lg:pt-24'>
				<div className='mx-auto flex h-full max-w-screen-lg flex-col gap-8 rounded-none border-none bg-background p-4'>
					<section>
						<TypographyH1>{name}</TypographyH1>
						<p className='text-md mt-2 text-muted-foreground'>
							{formatDistanceToNow(createdTime, { addSuffix: true })}
						</p>
					</section>
					<section className='border-b-1 pb-12'>
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
						{notes ? <p className='mt-4'>Notes: {notes}</p> : null}
					</section>
					<section className='[&>*]:border-b-1 [&>*]:border-muted [&>*]:py-4'>
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
						{pots.map(pot =>
							pot.winner.split(',').map((winner, winnerIndex, winners) => {
								return (
									<div key={`${pot.potIndex}_${winnerIndex}`} className='flex items-center gap-4'>
										<p className='text-xl'>{`${Number(winner) === position ? 'I win' : `Player ${winner} wins`}`}</p>
										<PotView value={potStatusByRound.at(-1)![pot.potIndex] / winners.length} index={pot.potIndex} />
									</div>
								)
							}),
						)}
						{!isWin ? (
							<div className='flex items-center gap-4 text-xl'>
								<p>I lose</p>
								<p className='rounded bg-red-300 px-2 py-1'>{loss}</p>
							</div>
						) : null}
					</section>
					<section>
						<TypographyH2 className='mb-4'>Analysis</TypographyH2>
						<Analysis analysis={analysis} />
					</section>
					<Dialog>
						{userId === applicationUserId && (
							<DialogTrigger asChild>
								<Button variant={'destructive'} className='ml-auto w-fit'>
									Delete Hand
								</Button>
							</DialogTrigger>
						)}
						<DialogContent className='sm:max-w-[450px]'>
							<DeleteHandDialogContent handId={params.id} />
						</DialogContent>
					</Dialog>
				</div>
			</main>
		</>
	)
}

export default HandPage
