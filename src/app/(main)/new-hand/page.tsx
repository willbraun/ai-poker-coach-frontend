'use client'

import { Card } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import TypographyH1 from '@/components/ui/typography/TypographyH1'
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group'
import { Bold, Italic, Underline } from 'lucide-react'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const zodCardGroup = z.object({
	player: z.number(),
	cards: z.array(
		z.object({
			value: z.string(),
			suit: z.string(),
		})
	),
	evaluation: z.string(),
})

const zodAction = z.object({
	player: z.number(),
	decision: z.number(),
	bet: z.number(),
})

const FormSchema = z.object({
	name: z.string(),
	gameStyle: z.string(),
	playerCount: z.string(),
	position: z.string(),
	smallBlind: z.string(),
	bigBlind: z.string(),
	ante: z.string(),
	bigBlindAnte: z.string(),
	myStack: z.string(),
	notes: z.string().optional(),
	round0Cards: zodCardGroup,
	round0Actions: z.array(zodAction),
	round1Cards: zodCardGroup,
	round1Actions: z.array(zodAction),
	round2Cards: zodCardGroup,
	round2Actions: z.array(zodAction),
	round3Cards: zodCardGroup,
	round3Actions: z.array(zodAction),
	villains: z.array(zodCardGroup),
})

const NewHand = () => {
	const form = useForm<z.infer<typeof FormSchema>>({
		resolver: zodResolver(FormSchema),
		defaultValues: {
			name: '',
			gameStyle: '',
			playerCount: '',
			position: '',
			smallBlind: '',
			bigBlind: '',
			ante: '',
			bigBlindAnte: '',
			myStack: '',
			notes: '',
			round0Cards: {
				player: 0,
				cards: [],
				evaluation: '',
			},
			round0Actions: [],
			round1Cards: {
				player: 0,
				cards: [],
				evaluation: '',
			},
			round1Actions: [],
			round2Cards: {
				player: 0,
				cards: [],
				evaluation: '',
			},
			round2Actions: [],
			round3Cards: {
				player: 0,
				cards: [],
				evaluation: '',
			},
			round3Actions: [],
			villains: [],
		},
	})

	const {
		control,
		handleSubmit,
		formState: { errors },
		watch,
	} = form

	const watchPlayerCount = watch('playerCount')

	const positionLabels = new Map<string, string>([
		['1', 'small blind'],
		['2', 'big blind'],
	])

	const playerCountInt = parseInt(watchPlayerCount)
	if (playerCountInt > 2) {
		positionLabels.set(watchPlayerCount, 'button')
	}
	if (playerCountInt > 3) {
		positionLabels.set((playerCountInt - 1).toString(), 'cutoff')
	}

	return (
		<main className='mt-24'>
			<div className='max-w-screen-sm mx-auto'>
				<TypographyH1 className='mb-8'>Add New Hand</TypographyH1>
				<Form {...form}>
					<form onSubmit={handleSubmit(data => console.log(data))} className='space-y-8'>
						<FormField
							control={control}
							name='name'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Title</FormLabel>
									<FormControl>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name='gameStyle'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Game Style</FormLabel>
									<FormControl>
										<RadioGroup
											onValueChange={field.onChange}
											defaultValue={field.value}
											className='flex flex-col space-y-1'
										>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='0' />
												</FormControl>
												<FormLabel className='font-normal'>Tournament</FormLabel>
											</FormItem>
											<FormItem className='flex items-center space-x-3 space-y-0'>
												<FormControl>
													<RadioGroupItem value='1' />
												</FormControl>
												<FormLabel className='font-normal'>Cash Game</FormLabel>
											</FormItem>
										</RadioGroup>
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name='playerCount'
							render={({ field }) => (
								<FormItem>
									<FormLabel>How many players were dealt in this hand?</FormLabel>
									<Select onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger className='w-48'>
												<SelectValue placeholder='Select a number' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											<SelectItem value='2'>2</SelectItem>
											<SelectItem value='3'>3</SelectItem>
											<SelectItem value='4'>4</SelectItem>
											<SelectItem value='5'>5</SelectItem>
											<SelectItem value='6'>6</SelectItem>
											<SelectItem value='7'>7</SelectItem>
											<SelectItem value='8'>8</SelectItem>
											<SelectItem value='9'>9</SelectItem>
											<SelectItem value='10'>10</SelectItem>
											<SelectItem value='11'>11</SelectItem>
											<SelectItem value='12'>12</SelectItem>
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name='position'
							render={({ field }) => (
								<FormItem>
									<FormLabel>What position were you relative to the small blind (1) ?</FormLabel>
									<Select onValueChange={field.onChange}>
										<FormControl>
											<SelectTrigger className='w-48'>
												<SelectValue placeholder='Select a number' />
											</SelectTrigger>
										</FormControl>
										<SelectContent>
											{Array.from({ length: parseInt(watchPlayerCount) }).map((_, i) => {
												const position = (i + 1).toString()
												const label = positionLabels.get(position)
												return (
													<SelectItem key={`position_choice_${position}`} value={`${position}`}>
														{position}
														{label && ` (${label})`}
													</SelectItem>
												)
											})}
										</SelectContent>
									</Select>
									<FormMessage />
								</FormItem>
							)}
						/>
						<FormField
							control={control}
							name='smallBlind'
							render={({ field }) => (
								<FormItem>
									<FormLabel>Small Blind</FormLabel>
									<FormControl className='w-48'>
										<Input {...field} />
									</FormControl>
									<FormMessage />
								</FormItem>
							)}
						/>
						<Button type='submit'>Submit</Button>
					</form>
				</Form>
				<p>Errors - {JSON.stringify(errors)}</p>
			</div>
		</main>
	)
}

export default NewHand
