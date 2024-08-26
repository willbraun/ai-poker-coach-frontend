'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createAccount } from './server'
import Link from 'next/link'
import { FC, useState } from 'react'
import FormError from '@/components/FormError'
import PasswordField from '@/components/PasswordField'
import { Home } from 'lucide-react'

const CreateAccount: FC = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const sixChars = password.length >= 6
	const lowercase = /[a-z]/.test(password)
	const uppercase = /[A-Z]/.test(password)
	const digit = /[0-9]/.test(password)
	const nonAlphanumeric = /\W/.test(password)
	const { pending } = useFormStatus()

	const disabled = !email || !password || pending || !sixChars || !lowercase || !uppercase || !digit || !nonAlphanumeric

	const initialState = {
		error: '',
	}

	const [state, formAction] = useFormState(createAccount, initialState)

	return (
		<main className='flex h-full w-full justify-end'>
			<section className='flex w-full items-center justify-center bg-accent lg:w-1/2'>
				<div className='w-96 p-4'>
					<h1 className='mb-4 text-3xl font-bold'>Create Account</h1>
					<form action={formAction}>
						<div className='mb-4'>
							<label htmlFor='email'>Email</label>
							<Input
								type='email'
								name='email'
								value={email}
								onChange={e => {
									setEmail(e.target.value)
								}}
							/>
						</div>
						<PasswordField password={password} setPassword={setPassword} className={'mb-4'} />
						<div className='mb-8'>
							<p>Password requirements</p>
							<ul>
								<li>{sixChars ? '✅' : '❌'} At least six characters</li>
								<li>{lowercase ? '✅' : '❌'} At least one lowercase letter (a-z)</li>
								<li>{uppercase ? '✅' : '❌'} At least one uppercase letter (A-Z)</li>
								<li>{digit ? '✅' : '❌'} At least one digit (0-9) </li>
								<li>{nonAlphanumeric ? '✅' : '❌'} At least one non-alphanumeric character </li>
							</ul>
						</div>
						<Button type='submit' disabled={disabled} className='mb-4 w-full text-lg'>
							{pending ? 'Creating Account...' : 'Create Account'}
						</Button>
					</form>
					<FormError error={state.error} />
					<p className='mb-2 mt-8'>
						Already have an account? Click{' '}
						<Link href='/login' className='underline'>
							here
						</Link>{' '}
						to log in
					</p>
					<Link href='/feed'>
						<Home />
					</Link>
				</div>
			</section>
		</main>
	)
}

export default CreateAccount
