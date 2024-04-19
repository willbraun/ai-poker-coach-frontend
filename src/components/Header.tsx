import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import Link from 'next/link'
import { Button } from './ui/button'

import { getAuth } from '@/lib/server_utils'
import { Book, CircleUser } from 'lucide-react'
import LogoutDropdownItem from './LogoutDropdownItem'

const Header = () => {
	const isAuth = getAuth()

	return (
		<header className='fixed h-16 top-0 z-20 bg-slate-300 flex w-full justify-between items-center px-4'>
			<Link href='/'>
				<p className='text-2xl font-semibold tracking-tight'>AI Poker Coach</p>
			</Link>
			{isAuth ? (
				<DropdownMenu>
					<DropdownMenuTrigger className='outline-none hover:bg-slate-200 rounded-full p-1' asChild>
						<CircleUser size='48px' />
					</DropdownMenuTrigger>
					<DropdownMenuContent className='mr-4'>
						<Link href='/my-hands' className='flex items-center'>
							<DropdownMenuItem className='text-lg'>
								<Book className='mr-2 h-4 w-4' />
								<span>My Hands</span>
							</DropdownMenuItem>
						</Link>
						<LogoutDropdownItem />
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
