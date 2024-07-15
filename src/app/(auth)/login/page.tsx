'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login } from './server'
import Link from 'next/link'
import FormError from '@/components/FormError'
import { FC, useState } from 'react'
import PasswordField from '@/components/PasswordField'
import { Home } from 'lucide-react'

const LoginFormDetails: FC = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const { pending } = useFormStatus()

	return (
		<>
			<div className='mb-4'>
				<label htmlFor='email'>Email</label>
				<Input type='email' name='email' value={email} onChange={e => setEmail(e.target.value)} />
			</div>
			<PasswordField password={password} setPassword={setPassword} className={'mb-8'} />
			<Button type='submit' disabled={pending} className='mb-4 w-full text-lg'>
				{pending ? 'Logging in...' : 'Log in'}
			</Button>
		</>
	)
}

const Login: FC = () => {
	const initialState = {
		error: '',
	}

	const [state, formAction] = useFormState(login, initialState)

	return (
		<main className='flex h-full w-full justify-end'>
			<section className='flex w-full items-center justify-center bg-accent lg:w-1/2'>
				<div className='w-96 p-4'>
					<h1 className='mb-4 text-3xl font-bold'>Log in</h1>
					<form action={formAction}>
						<LoginFormDetails />
					</form>
					<FormError error={state.error} />
					<p className='mb-2 mt-8'>
						No account? Click{' '}
						<Link href='/create-account' className='underline'>
							here
						</Link>{' '}
						to create one
					</p>
					<Link href='/feed'>
						<Home />
					</Link>
				</div>
			</section>
		</main>
	)
}

export default Login
