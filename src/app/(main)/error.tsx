'use client'

import { Button } from '@/components/ui/button'
import { FC } from 'react'

interface ErrorPageProps {
	error: Error & { digest?: string }
	reset: () => void
}

const Error: FC<ErrorPageProps> = ({ error, reset }) => {
	return (
		<main className='flex w-full flex-col items-center justify-center pt-24'>
			<h1 className='mb-8 text-3xl'>Error: {error.message || 'something went wrong...'}</h1>
			<p className='mb-8'>Last refreshed: {new Date().toLocaleTimeString()}</p>
			<Button className='text-xl' onClick={reset}>
				Try again
			</Button>
		</main>
	)
}

export default Error
