'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createAccount } from './server'
import Link from 'next/link'
import { useEffect, useState } from 'react'

const CreateAccount = () => {
	const initialState = {
		error: '',
	}

	const [state, formAction] = useFormState(createAccount, initialState)
	const { pending } = useFormStatus()

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const disabled = !email || !password || password.length < 6 || pending

	return (
		<main className='w-full h-full flex justify-end'>
			<section className='w-full lg:w-1/2 bg-gray-300 flex justify-center items-center'>
				<div className='w-96'>
					<h1 className='mb-4 font-bold text-3xl'>Create Account</h1>
					<form action={formAction}>
						<div className='mb-4'>
							<label htmlFor='email'>Email</label>
							<Input
								type='email'
								name='email'
								onChange={e => {
									setEmail(e.target.value)
								}}
							/>
						</div>
						<div className='mb-8'>
							<label htmlFor='password'>Password</label>
							<Input
								type='password'
								name='password'
								onChange={e => {
									setPassword(e.target.value)
								}}
							/>
						</div>
						<Button type='submit' disabled={disabled} className='mb-4 w-full text-lg'>
							{pending ? 'Creating Account...' : 'Create Account'}
						</Button>
					</form>
					<p className='text-sm text-red-500 whitespace-pre-line'>{state.error}</p>
					<p className='mt-8'>
						Already have an account? Click{' '}
						<Link href='/login' className='underline'>
							here
						</Link>{' '}
						to log in
					</p>
				</div>
			</section>
		</main>
	)
}

export default CreateAccount
