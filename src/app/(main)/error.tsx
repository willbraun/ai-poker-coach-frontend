'use client'

import { Button } from '@/components/ui/button'
import { FC } from 'react'

interface ErrorPageProps {
	error: Error & { digest?: string }
	reset: () => void
}

const Error: FC<ErrorPageProps> = ({ error, reset }) => {
	return (
		<main className='w-full h-full flex justify-center items-center flex-col'>
			<h1 className='text-3xl mb-8'>Error: {error.message || 'something went wrong...'}</h1>
			<Button className='text-xl' onClick={() => reset()}>
				Try again
			</Button>
		</main>
	)
}

export default Error
