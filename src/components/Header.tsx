import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import { getAuth } from '@/lib/server_utils'
import { Book, CircleUser, Home } from 'lucide-react'
import Link from 'next/link'
import LogoutDropdownItem from './LogoutDropdownItem'
import { Button } from './ui/button'
import { FC } from 'react'
import NewHandLink from './NewHandLink'

const Header: FC = () => {
	const isAuth = getAuth()

	return (
		<header className='fixed top-0 z-20 flex h-16 w-full items-center gap-4 border-b-1 bg-background px-4'>
			<Link href='/'>
				<Home />
			</Link>
			<Link href='/feed' className='mr-auto'>
				<p className='text-xl font-semibold tracking-tight sm:text-3xl'>AI Poker Coach</p>
			</Link>
			{isAuth ? (
				<>
					<NewHandLink />
					<DropdownMenu>
						<DropdownMenuTrigger className='rounded p-1 outline-none hover:cursor-pointer hover:underline' asChild>
							<div className='flex items-center gap-2 px-2'>
								<p className='hidden md:block'>My Account</p>
								<CircleUser size='32px' />
							</div>
						</DropdownMenuTrigger>
						<DropdownMenuContent className='mr-4'>
							<Link href='/my-hands' className='flex items-center hover:cursor-pointer'>
								<DropdownMenuItem className='text-lg'>
									<Book className='mr-2 h-4 w-4' />
									<span>My Hands</span>
								</DropdownMenuItem>
							</Link>
							<LogoutDropdownItem />
						</DropdownMenuContent>
					</DropdownMenu>
				</>
			) : (
				<div className='ml-auto flex items-center gap-8'>
					<Button variant='link' className='p-0'>
						<Link href='/login' className='text-black underline'>
							Log in
						</Link>
					</Button>
					<Button>
						<Link href='/create-account'>Sign up</Link>
					</Button>
				</div>
			)}
		</header>
	)
}

export default Header
