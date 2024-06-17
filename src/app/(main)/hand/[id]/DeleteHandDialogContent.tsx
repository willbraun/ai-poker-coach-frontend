'use client'

import { Button, buttonVariants } from '@/components/ui/button'
import { DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { set } from 'date-fns'
import Cookies from 'js-cookie'
import { revalidatePath } from 'next/cache'
import { useState } from 'react'

interface DeleteHandDialogContentProps {
	handId: string
	accessToken: string
	apiUrl: string
}

const DeleteHandDialogContent = ({ handId, accessToken, apiUrl }: DeleteHandDialogContentProps) => {
	const [loading, setLoading] = useState(false)
	const [success, setSuccess] = useState('')
	const [error, setError] = useState('')

	const deleteHand = async (id: string, accessToken: string) => {
		if (!apiUrl) {
			setError('API URL not found.')
			return
		}

		setLoading(true)

		const res = await fetch(`${apiUrl}/hand/${id}`, {
			method: 'DELETE',
			headers: {
				Authorization: `Bearer ${accessToken}`,
				'Content-Type': 'application/json',
			},
		})

		setLoading(false)

		if (res.status === 200) {
			setSuccess('Hand deleted successfully. Redirecting...')
			setTimeout(() => {
				revalidatePath('/', 'layout')
				window.location.href = '/my-hands'
			}, 3000)
		} else {
			console.error(res)
			setError(res.statusText)
			return
		}

		return
	}

	return (
		<>
			<DialogHeader>
				<DialogTitle>Delete Hand</DialogTitle>
				<DialogDescription>This action cannot be undone.</DialogDescription>
			</DialogHeader>
			<DialogFooter>
				{success ? (
					<p className='w-full text-center text-green-600'>{success}</p>
				) : (
					<Button
						variant={'destructive'}
						onClick={async () => await deleteHand(handId, accessToken)}
						disabled={loading}
					>
						Delete
					</Button>
				)}

				{error && (
					<div className='w-full'>
						<p className='text-pure-red'>{error}</p>
					</div>
				)}
			</DialogFooter>
		</>
	)
}

export default DeleteHandDialogContent
