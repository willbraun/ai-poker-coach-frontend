import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Hand } from '@/lib/types'
import ellipsis from '@/lib/images/icons/ellipsis.svg'
import Link from 'next/link'
import SmallCard from './SmallCard'

export interface HandPreviewProps {
	hand: Hand
}

const HandPreview = ({ hand }: HandPreviewProps) => {
	return (
		<Card className='mb-4'>
			<CardHeader>
				<CardTitle>{hand.handSteps.name}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className='mb-4 flex items-center'>
					<p className='pr-8'>{hand.handSteps.rounds.at(-1)?.evaluation.value ?? ''}</p>
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
				<p>{hand.analysis}</p>
			</CardContent>
			<CardFooter className='justify-end'>
				{/* temporary link to login */}
				<Link href='/login' className='hover:bg-slate-200 rounded-full'>
					<Image src={ellipsis} alt='see hand details' className='w-8 h-8 m-1' />
				</Link>
			</CardFooter>
		</Card>
	)
}

export default HandPreview
