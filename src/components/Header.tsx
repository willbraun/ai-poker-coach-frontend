import Link from 'next/link'
import { Button } from './ui/button'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'

import { Book } from 'lucide-react'
import { CircleUser } from 'lucide-react'
import LogoutDropdownItem from './LogoutDropdownItem'
import { useGetAuth } from '@/lib/hooks'

const Header = () => {
	const isAuth = useGetAuth()

	return (
		<header className='fixed h-16 top-0 z-20 bg-slate-300 flex w-full justify-between items-center px-4'>
			<Link href='/'>
				<h1 className='text-2xl font-semibold tracking-tight'>AI Poker Coach</h1>
			</Link>
			{isAuth ? (
				<DropdownMenu>
					<DropdownMenuTrigger className='outline-none hover:bg-slate-200 rounded-full p-1'>
						<CircleUser size='36px' />
					</DropdownMenuTrigger>
					<DropdownMenuContent className='mr-4'>
						<DropdownMenuItem className='text-lg'>
							<Link href='/my-hands' className='flex items-center'>
								<Book className='mr-2 h-4 w-4' />
								<span>My Hands</span>
							</Link>
						</DropdownMenuItem>
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
