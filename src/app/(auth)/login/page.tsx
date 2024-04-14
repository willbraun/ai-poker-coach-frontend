'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { login } from './server'
import Link from 'next/link'
import FormError from '@/components/FormError'
import { useEffect, useState } from 'react'
import PasswordField from '@/components/PasswordField'

const LoginFormDetails = () => {
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

const Login = () => {
	const initialState = {
		error: '',
	}

	const [state, formAction] = useFormState(login, initialState)

	return (
		<main className='w-full h-full flex justify-end'>
			<section className='w-full lg:w-1/2 bg-slate-300 flex justify-center items-center'>
				<div className='w-96 p-4'>
					<h1 className='mb-4 font-bold text-3xl'>Log in</h1>
					<form action={formAction}>
						<LoginFormDetails />
					</form>
					<FormError error={state.error} />
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
