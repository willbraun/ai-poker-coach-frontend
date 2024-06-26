import ellipsis from '@/lib/images/icons/ellipsis.svg'
import { Hand } from '@/lib/types'
import { getIsWin } from '@/lib/utils'
import { formatDistanceToNow } from 'date-fns'
import Image from 'next/image'
import Link from 'next/link'
import Analysis from './Analysis'
import SmallCard from './SmallCard'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { FC } from 'react'
import { buttonVariants } from './ui/button'

const HandPreview: FC<{ hand: Hand }> = ({ hand }) => {
	const isWin = getIsWin(hand)

	return (
		<Card className='relative mb-2 rounded-none lg:mb-4 lg:rounded-xl'>
			<CardHeader>
				<div className='flex justify-between'>
					<CardTitle className='xs:text-2xl flex justify-between lg:text-4xl'>{hand.handSteps.name}</CardTitle>
					<div className='font-bold'>{isWin ? 'Win' : 'Loss'}</div>
				</div>
				<CardDescription className='lg:text-lg'>
					{formatDistanceToNow(hand.createdTime, { addSuffix: true })}
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className='mb-4 flex flex-wrap items-center gap-y-2 border-b-1 border-accent pb-4 md:mb-8 md:pb-8'>
					<p className='pr-8 lg:text-lg'>{hand.handSteps.rounds.at(-1)?.evaluation.value ?? ''}</p>
					<div className='flex items-center'>
						<div className='flex gap-2 border-r-2 border-black pr-4'>
							<SmallCard card={hand.handSteps.rounds[0].cards[0]} />
							<SmallCard card={hand.handSteps.rounds[0].cards[1]} />
						</div>
						<div className='flex gap-2 pl-4'>
							{hand.handSteps.rounds.map(round =>
								round.cards.filter(card => card.player === 0).map(card => <SmallCard key={card.step} card={card} />),
							)}
						</div>
					</div>
				</div>
				<Analysis analysis={hand.analysis} />
			</CardContent>
			<CardFooter className='justify-end'>
				<Link href={`/hand/${hand.id}`} className={`${buttonVariants({ variant: 'link' })}`}>
					View details
				</Link>
			</CardFooter>
		</Card>
	)
}

export default HandPreview
