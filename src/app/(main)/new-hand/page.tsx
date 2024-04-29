'use client'

import { Card } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

const NewHand = () => {
	const form = useForm()

	const [formValue, setFormValue] = useState<NewHandState>({
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
		round0Cards: {} as FormCardGroup,
		round0Actions: [],
		round1Cards: {} as FormCardGroup,
		round1Actions: [],
		round2Cards: {} as FormCardGroup,
		round2Actions: [],
		round3Cards: {} as FormCardGroup,
		round3Actions: [],
		villains: [],
	})

	return (
		<main className='mt-24'>
			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
					<FormField
						control={form.control}
						name='username'
						render={({ field }) => (
							<FormItem>
								<FormLabel>Username</FormLabel>
								<FormControl>
									<Input placeholder='shadcn' {...field} />
								</FormControl>
								<FormDescription>This is your public display name.</FormDescription>
								<FormMessage />
							</FormItem>
						)}
					/>
					<Button type='submit'>Submit</Button>
				</form>
			</Form>
		</main>
	)
}

export default NewHand
