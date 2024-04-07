import Link from 'next/link'

const Header = () => {
	return (
		<header className='bg-gray-300 sticky top-0 z-20 flex w-full p-8 justify-between'>
			<h1>AI Poker Coach</h1>
			<div className='flex gap-4'>
				<Link href='/login'>Log in</Link>
				<Link href='/create-account'>Sign up</Link>
			</div>
		</header>
	)
}

export default Header
