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

const CardInput = ({ cardIndex, name }: { cardIndex: number; name: string }) => {
	const { setValue } = useFormContext()

	// setValue(`${name}.cards.${cardIndex}`, { value: newValue, suit: newSuit })

	return (
		<Popover>
			<PopoverTrigger>
				<div className='w-20 h-32 border-dashed border-1 border-black rounded-lg flex justify-center items-center bg-slate-200 hover:brightness-105 hover:cursor-pointer'>
					<Plus size='40px' />
				</div>
			</PopoverTrigger>
			<PopoverContent className='flex gap-4'>
				<div className='w-1/2 text-center flex flex-col'>
					<p className='mb-6'>Value</p>
					<div className=''>
						<Select>
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
				<div className='w-1/2 text-center'>
					<p className='mb-2'>Suit</p>
					<Button variant='ghost'>
						<Image src={club} alt='club' />
					</Button>
					<Button variant='ghost'>
						<Image src={diamond} alt='diamond' />
					</Button>
					<Button variant='ghost'>
						<Image src={heart} alt='heart' />
					</Button>
					<Button variant='ghost'>
						<Image src={spade} alt='spade' />
					</Button>
				</div>
			</PopoverContent>
		</Popover>
	)
}

export default CardInput
