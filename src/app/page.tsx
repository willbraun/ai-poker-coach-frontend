import { FC } from 'react'
import Image from 'next/image'
import robot from '@/lib/images/poker-robot.jpeg'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import Footer from '@/components/Footer'
import TypingAnimation from '@/components/TypingAnimation'

const HomeCard: FC<{ message: string }> = ({ message }) => {
	return (
		<div className='rounded-xl border-1 border-accent bg-transparent p-4 text-center text-white'>
			<p className='text-3xl'>{message}</p>
		</div>
	)
}

const Home: FC = () => {
	return (
		<main className='fixed h-full w-full bg-gradient-to-br from-primary to-gray-900'>
			<div className='h-full overflow-y-auto'>
				<div className='flex flex-wrap items-center justify-evenly gap-x-8 gap-y-16 px-8 py-16'>
					<div className='flex flex-col items-center gap-4 text-center'>
						<h1 className='inline-block text-6xl font-bold tracking-tight text-white sm:text-8xl'>AI Poker Coach</h1>
						<p className='text-3xl text-white'>Poker advice in English, not charts</p>
					</div>
					<Image src={robot} alt='poker robot' width={400} className='rounded-3xl shadow-lg' priority={true} />
				</div>
				<div className='mx-auto min-h-[26rem] w-5/6 font-serif text-white sm:min-h-80 md:min-h-48 2xl:w-3/4'>
					<TypingAnimation />
				</div>
				<div className='grid grid-cols-1 gap-8 p-8 md:grid-cols-3'>
					<HomeCard message={'Analyze your own hands in natural language, without complex charts'} />
					<HomeCard message={'Record hands to your account, and learn from other players'} />
					<HomeCard message={'Powered by AI enhanced with poker training data'} />
				</div>
				<div className='mt-16 flex w-full justify-center px-8 pb-16'>
					<div className='flex w-full max-w-screen-md flex-col gap-4'>
						<Button className='h-fit w-full p-4'>
							<Link href='/create-account' className='text-3xl'>
								Sign up
							</Link>
						</Button>
						<div className='flex w-full gap-4'>
							<Button className='h-fit w-full p-4' variant='secondary'>
								<Link href='/login' className='text-3xl'>
									Log in
								</Link>
							</Button>
							<Button className='h-fit w-full p-4' variant='secondary'>
								<Link href='/feed' className='text-3xl'>
									Open app
								</Link>
							</Button>
						</div>
					</div>
				</div>
				<Footer textColor='text-white' iconFill='fill-white' />
			</div>
		</main>
	)
}

export default Home
