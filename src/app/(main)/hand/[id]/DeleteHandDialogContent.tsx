'use client'

import { Button } from '@/components/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { FC, useEffect } from 'react'
import { useFormState, useFormStatus } from 'react-dom'
import { deleteHand } from './server'

const Submit = () => {
	const { pending } = useFormStatus()

	return (
		<Button type='submit' variant='destructive' disabled={pending}>
			{pending ? 'Deleting...' : 'Delete Hand'}
		</Button>
	)
}

export const DeleteHandDialogContent: FC<{ handId: string }> = ({ handId }) => {
	const initialState = {
		success: '',
		error: '',
	}

	const [state, formAction] = useFormState(deleteHand, initialState)
	const router = useRouter()

	useEffect(() => {
		if (state.success) {
			setTimeout(() => {
				router.push('/my-hands')
			}, 2000)
		}
	}, [state.success, router])

	return (
		<>
			<DialogHeader>
				<DialogTitle className='text-2xl'>Warning</DialogTitle>
				<DialogDescription className='text-lg'>This action cannot be undone.</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				{state.success ? (
					<p className='w-full text-center text-green-600'>{state.success}</p>
				) : (
					<form action={formAction}>
						<input type='hidden' name='handId' value={handId} />
						<Submit />
					</form>
				)}

				{state.error && (
					<div className='w-full'>
						<p className='text-pure-red'>{state.error}</p>
					</div>
				)}
			</DialogFooter>
		</>
	)
}

export default DeleteHandDialogContent
