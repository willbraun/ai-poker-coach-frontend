import ellipsis from '@/lib/images/icons/ellipsis.svg'
import { Hand } from '@/lib/types'
import { getIsWin } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import Analysis from './Analysis'
import SmallCard from './SmallCard'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'

const HandPreview = ({ hand }: { hand: Hand }) => {
	const isWin = getIsWin(hand)

	return (
		<Card className='relative mb-2 lg:mb-4 rounded-none lg:rounded-xl'>
			<CardHeader>
				<div className='flex justify-between'>
					<CardTitle className='flex justify-between'>{hand.handSteps.name}</CardTitle>
					<div className={`px-2 rounded ${isWin ? 'bg-green-200' : 'bg-red-200'}`}>{isWin ? 'Win' : 'Loss'}</div>
				</div>
				<CardDescription>{formatDistanceToNow(hand.createdTime, { addSuffix: true })}</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='mb-4 flex flex-wrap items-center gap-y-2'>
					<p className='pr-8'>{hand.handSteps.rounds.at(-1)?.evaluation.value ?? ''}</p>
					<div className='flex items-center'>
						<div className='flex gap-2 pr-4 border-r-2 border-black'>
							<SmallCard card={hand.handSteps.rounds[0].cards[0]} />
							<SmallCard card={hand.handSteps.rounds[0].cards[1]} />
						</div>
						<div className='flex gap-2 pl-4'>
							{hand.handSteps.rounds.map(round =>
								round.cards.filter(card => card.player === 0).map(card => <SmallCard key={card.step} card={card} />)
							)}
						</div>
					</div>
				</div>
				<Analysis analysis={hand.analysis} />
			</CardContent>
			<CardFooter className='justify-end'>
				<Link href={`/hand/${hand.id}`} className='hover:bg-slate-200 rounded-full'>
					<Image src={ellipsis} alt='see hand details' className='w-8 h-8 m-1' />
				</Link>
			</CardFooter>
		</Card>
	)
}

export default HandPreview
