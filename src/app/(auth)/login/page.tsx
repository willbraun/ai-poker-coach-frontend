'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login } from './server'
import Link from 'next/link'

const Login = () => {
	const initialState = {
		error: '',
	}

	const [state, formAction] = useFormState(login, initialState)
	const { pending } = useFormStatus()

	return (
		<main className='w-full h-full flex justify-end'>
			<section className='w-full lg:w-1/2 bg-gray-300 flex justify-center items-center'>
				<div className='w-96'>
					<h1 className='mb-4 font-bold text-3xl'>Log in</h1>
					<form action={formAction}>
						<div className='mb-4'>
							<label htmlFor='email'>Email</label>
							<Input type='email' name='email' />
						</div>
						<div className='mb-8'>
							<label htmlFor='password'>Password</label>
							<Input type='password' name='password' />
						</div>
						<Button type='submit' disabled={pending} className='mb-4 w-full text-lg'>
							{pending ? 'Logging in...' : 'Log in'}
						</Button>
					</form>
					<p className='text-sm text-red-500 whitespace-pre-line'>{state.error}</p>
					<p className='mt-8'>
						No account? Click{' '}
						<Link href='/create-account' className='underline'>
							here
						</Link>{' '}
						to create one
					</p>
				</div>
			</section>
		</main>
	)
}

export default Login
