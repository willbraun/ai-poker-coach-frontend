'use client'

import { Button } from '@/components/ui/button'
import { FC } from 'react'

interface ErrorPageProps {
	error: Error & { digest?: string }
	reset: () => void
}

const Error: FC<ErrorPageProps> = ({ error, reset }) => {
	return (
		<main className='flex h-full w-full flex-col items-center justify-center'>
			<h1 className='mb-8 text-3xl'>Error: {error.message || 'something went wrong...'}</h1>
			<Button className='text-xl' onClick={() => reset()}>
				Try again
			</Button>
		</main>
	)
}

export default Error
