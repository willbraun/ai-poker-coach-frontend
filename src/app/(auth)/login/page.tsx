'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login } from '@/server/login'

const Login = () => {
	const initialState = {
		error: '',
	}

	const [state, formAction] = useFormState(login, initialState)
	const { pending } = useFormStatus()

	return (
		<main className='w-full h-full flex justify-end'>
			<section className='w-1/2 bg-gray-300'>
				<form action={formAction}>
					<div>
						<label htmlFor='email'>Email</label>
						<Input type='email' name='email' />
					</div>
					<div>
						<label htmlFor='password'>Password</label>
						<Input type='password' name='password' />
					</div>
					<Button type='submit' disabled={pending}>
						Submit
					</Button>
				</form>
				<p className='text-md text-red-500 whitespace-pre-line'>{state.error}</p>
			</section>
		</main>
	)
}

export default Login
