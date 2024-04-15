'use client'

import Link from 'next/link'
import { Button } from './ui/button'
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'

import { Book, LogOut } from 'lucide-react'
import { CircleUser } from 'lucide-react'
import logout from '@/app/(auth)/(logout)/server'
import { useAuthStore } from '@/lib/store'
import Image from 'next/image'

const Header = () => {
	const { isAuth, setAuth } = useAuthStore()

	const handleLogOut = async () => {
		await logout()
		setAuth(false)
	}

	return (
		<header className='fixed h-16 top-0 z-20 bg-slate-300 flex w-full justify-between items-center px-4'>
			<h1 className='text-2xl font-semibold tracking-tight'>AI Poker Coach</h1>
			{isAuth ? (
				<DropdownMenu>
					<DropdownMenuTrigger>
						<CircleUser size='36px' />
					</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem className='text-lg'>
							<Link href='/my-hands' className='flex items-center'>
								<Book className='mr-2 h-4 w-4' />
								<span>My Hands</span>
							</Link>
						</DropdownMenuItem>
						<DropdownMenuItem className='text-lg' onSelect={handleLogOut}>
							<LogOut className='mr-2 h-4 w-4' />
							<span>Log out</span>
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<div className='flex items-center gap-4'>
					<Button size='sm'>
						<Link href='/login'>Log in</Link>
					</Button>
					<Button size='sm'>
						<Link href='/create-account'>Sign up</Link>
					</Button>
				</div>
			)}
		</header>
	)
}

export default Header
