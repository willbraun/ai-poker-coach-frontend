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
import { FC } from 'react'

interface CardInputProps {
	cardIndex: number
	groupSelector: string
	disabled: boolean
}

const CardInput: FC<CardInputProps> = ({ cardIndex, groupSelector, disabled }) => {
	const { setValue, watch } = useFormContext()

	const cardSelector = `${groupSelector}.cards.${cardIndex}`
	const card = watch(cardSelector)

	const setSuit = (suit: string) => setValue(cardSelector, { ...card, suit })

	return (
		<Popover>
			<PopoverTrigger disabled={disabled}>
				{card?.value && card?.suit ? (
					<LargeCard value={card.value} suit={card.suit} disabled={disabled} />
				) : (
					<div className='flex h-36 w-24 items-center justify-center rounded-lg border-1 border-dashed border-black bg-background hover:cursor-pointer'>
						<Plus size='40px' />
					</div>
				)}
			</PopoverTrigger>
			<PopoverContent className='flex gap-4'>
				<div className='flex w-1/2 flex-col gap-4 text-center'>
					<FormLabel>Value</FormLabel>
					<div className=''>
						<Select value={card?.value ?? ''} onValueChange={value => setValue(cardSelector, { ...card, value })}>
							<SelectTrigger>
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value='A'>Ace</SelectItem>
								<SelectItem value='K'>King</SelectItem>
								<SelectItem value='Q'>Queen</SelectItem>
								<SelectItem value='J'>Jack</SelectItem>
								<SelectItem value='T'>10</SelectItem>
								<SelectItem value='9'>9</SelectItem>
								<SelectItem value='8'>8</SelectItem>
								<SelectItem value='7'>7</SelectItem>
								<SelectItem value='6'>6</SelectItem>
								<SelectItem value='5'>5</SelectItem>
								<SelectItem value='4'>4</SelectItem>
								<SelectItem value='3'>3</SelectItem>
								<SelectItem value='2'>2</SelectItem>
							</SelectContent>
						</Select>
					</div>
				</div>
				<div className='flex w-1/2 flex-col gap-4 text-center'>
					<FormLabel>Suit</FormLabel>
					<div className='grid grid-cols-2 grid-rows-2 gap-1'>
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
