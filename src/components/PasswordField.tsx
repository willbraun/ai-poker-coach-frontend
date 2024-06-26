import { FC, useState } from 'react'
import { Button } from './ui/button'
import { Input } from './ui/input'

interface PasswordFieldProps {
	password: string
	setPassword: (newValue: string) => void
	className?: string
}

const PasswordField: FC<PasswordFieldProps> = ({ password, setPassword, className }) => {
	const [show, setShow] = useState(false)

	const toggleShow = () => setShow(!show)

	return (
		<div className={`relative ${className}`}>
			<label htmlFor='password'>Password</label>
			<Input
				type={show ? 'text' : 'password'}
				name='password'
				value={password}
				onChange={e => {
					setPassword(e.target.value)
				}}
			/>
			<Button type='button' className='absolute right-2 top-11 h-6 w-11 -translate-y-1/2 text-xs' onClick={toggleShow}>
				{show ? 'Hide' : 'Show'}
			</Button>
		</div>
	)
}

export default PasswordField
