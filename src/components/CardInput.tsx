import { useFormContext } from 'react-hook-form'
import { Plus } from 'lucide-react'
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover'
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import club from '@/lib/images/icons/club.svg'
import diamond from '@/lib/images/icons/diamond.svg'
import heart from '@/lib/images/icons/heart.svg'
import spade from '@/lib/images/icons/spade.svg'
import { FormLabel } from './ui/form'
import LargeCard from './LargeCard'

const CardInput = ({ cardIndex, groupSelector }: { cardIndex: number; groupSelector: string }) => {
	const { setValue, watch } = useFormContext()

	const cardSelector = `${groupSelector}.cards.${cardIndex}`
	const card = watch(cardSelector)

	const setSuit = (suit: string) => setValue(cardSelector, { ...card, suit })

	return (
		<Popover>
			<PopoverTrigger>
				{card?.value && card?.suit ? (
					<LargeCard value={card.value} suit={card.suit} />
				) : (
					<div className='w-24 h-36 border-dashed border-1 border-black rounded-lg flex justify-center items-center bg-slate-200 hover:brightness-105 hover:cursor-pointer'>
						<Plus size='40px' />
					</div>
				)}
			</PopoverTrigger>
			<PopoverContent className='flex gap-4'>
				<div className='w-1/2 text-center flex flex-col gap-4'>
					<FormLabel>Value</FormLabel>
					<div className=''>
						<Select value={card?.value ?? ''} onValueChange={value => setValue(cardSelector, { ...card, value })}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='2'>2</SelectItem>
								<SelectItem value='3'>3</SelectItem>
								<SelectItem value='4'>4</SelectItem>
								<SelectItem value='5'>5</SelectItem>
								<SelectItem value='6'>6</SelectItem>
								<SelectItem value='7'>7</SelectItem>
								<SelectItem value='8'>8</SelectItem>
								<SelectItem value='9'>9</SelectItem>
								<SelectItem value='T'>10</SelectItem>
								<SelectItem value='J'>Jack</SelectItem>
								<SelectItem value='Q'>Queen</SelectItem>
								<SelectItem value='K'>King</SelectItem>
								<SelectItem value='A'>Ace</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className='w-1/2 text-center flex flex-col gap-4'>
					<FormLabel>Suit</FormLabel>
					<div className='grid grid-rows-2 grid-cols-2 gap-1'>
						<Button
							variant='ghost'
							className={`p-0 ${card?.suit === 'C' ? 'border-2 border-black' : ''}`}
							onClick={() => setSuit('C')}
						>
							<Image src={club} alt='club' width={24} />
						</Button>
						<Button
							variant='ghost'
							className={`p-0 ${card?.suit === 'D' ? 'border-2 border-black' : ''}`}
							onClick={() => setSuit('D')}
						>
							<Image src={diamond} alt='diamond' width={24} />
						</Button>
						<Button
							variant='ghost'
							className={`p-0 ${card?.suit === 'H' ? 'border-2 border-black' : ''}`}
							onClick={() => setSuit('H')}
						>
							<Image src={heart} alt='heart' width={24} />
						</Button>
						<Button
							variant='ghost'
							className={`p-0 ${card?.suit === 'S' ? 'border-2 border-black' : ''}`}
							onClick={() => setSuit('S')}
						>
							<Image src={spade} alt='spade' width={24} />
						</Button>
					</div>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default CardInput
