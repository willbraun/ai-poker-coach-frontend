'use client'

import { useFormState, useFormStatus } from 'react-dom'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { createAccount } from './server'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import FormError from '@/components/FormError'
import PasswordField from '@/components/PasswordField'

interface PasswordValidation {
	sixChars: boolean
	lowercase: boolean
	uppercase: boolean
	digit: boolean
	nonAlphanumeric: boolean
}

const CreateAccountFormDetails = () => {
	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')
	const [passwordValidation, setPasswordValidation] = useState<PasswordValidation>({
		sixChars: false,
		lowercase: false,
		uppercase: false,
		digit: false,
		nonAlphanumeric: false,
	})

	const { pending } = useFormStatus()

	const disabled = !email || !password || Object.values(passwordValidation).includes(false) || pending

	useEffect(() => {
		setPasswordValidation({
			sixChars: password.length >= 6,
			lowercase: /[a-z]/.test(password),
			uppercase: /[A-Z]/.test(password),
			digit: /[0-9]/.test(password),
			nonAlphanumeric: /\W/.test(password),
		})
	}, [password])

	return (
		<>
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
					<li>{passwordValidation.sixChars ? '✅' : '❌'} At least six characters</li>
					<li>{passwordValidation.lowercase ? '✅' : '❌'} At least one lowercase letter (a-z)</li>
					<li>{passwordValidation.uppercase ? '✅' : '❌'} At least one uppercase letter (A-Z)</li>
					<li>{passwordValidation.digit ? '✅' : '❌'} At least one digit (0-9) </li>
					<li>{passwordValidation.nonAlphanumeric ? '✅' : '❌'} At least one non-alphanumeric character </li>
				</ul>
			</div>
			<Button type='submit' disabled={disabled} className='mb-4 w-full text-lg'>
				{pending ? 'Creating Account...' : 'Create Account'}
			</Button>
		</>
	)
}

const CreateAccount = () => {
	const initialState = {
		error: '',
	}

	const [state, formAction] = useFormState(createAccount, initialState)

	return (
		<main className='w-full h-full flex justify-end'>
			<section className='w-full lg:w-1/2 bg-gray-300 flex justify-center items-center'>
				<div className='w-96'>
					<h1 className='mb-4 font-bold text-3xl'>Create Account</h1>
					<form action={formAction}>
						<CreateAccountFormDetails />
					</form>
					<FormError error={state.error} />
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
