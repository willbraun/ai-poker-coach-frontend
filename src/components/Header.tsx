'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import logout from '@/app/(auth)/(logout)/server'
import { useAuthStore } from '@/lib/store'

const Header = () => {
	const { isAuth, setAuth } = useAuthStore()

	const handleClick = async () => {
		await logout()
		setAuth(false)
	}

	return (
		<header className='bg-slate-300 fixed top-0 z-20 flex w-full p-4 justify-between'>
			<h1>AI Poker Coach</h1>
			{isAuth ? (
				<Button onClick={handleClick}>Logout</Button>
			) : (
				<div className='flex gap-4'>
					<Link href='/login'>Log in</Link>
					<Link href='/create-account'>Sign up</Link>
				</div>
			)}
		</header>
	)
}

export default Header
