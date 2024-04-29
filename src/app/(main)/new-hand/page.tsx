'use client'

import { Card } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import TypographyH1 from '@/components/ui/typography/TypographyH1'

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
	gameStyle: z.number(),
	playerCount: z.number(),
	position: z.number(),
	smallBlind: z.number(),
	bigBlind: z.number(),
	ante: z.number(),
	bigBlindAnte: z.number(),
	myStack: z.number(),
	notes: z.string(),
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
			gameStyle: 0,
			playerCount: 0,
			position: 0,
			smallBlind: 0,
			bigBlind: 0,
			ante: 0,
			bigBlindAnte: 0,
			myStack: 0,
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
	} = form

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
						<Button type='submit'>Submit</Button>
					</form>
				</Form>
			</div>
		</main>
	)
}

export default NewHand
