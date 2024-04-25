'use client'

import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { useNewHandStore } from './store'

const NewHand = () => {
	const { prompts, activePrompt, increment, decrement } = useNewHandStore()
	const isLast = false
	const inputType = prompts[activePrompt]?.type ?? 'unknown'

	return (
		<main className='mt-24'>
			<Card className='max-w-screen-lg mx-auto'>New Hand</Card>
			<div className='absolute bottom-8 left-1/2 -translate-x-1/2 w-full max-w-screen-md border-slate-500 border-1 p-4 rounded'>
				<p>{inputType}</p>
				<div className='flex justify-between gap-4'>
					<Button className='mr-auto' onClick={decrement}>
						Back
					</Button>
					{isLast ? <Button>Analyze</Button> : <Button onClick={increment}>Next</Button>}
				</div>
			</div>
		</main>
	)
}

export default NewHand
