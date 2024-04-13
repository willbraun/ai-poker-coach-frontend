import Image from 'next/image'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Hand } from '@/lib/types'
import ellipsis from '@/lib/icons/ellipsis.svg'
import Link from 'next/link'

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
