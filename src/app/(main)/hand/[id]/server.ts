'use server'

import { getAuthData } from '@/lib/server_utils'
import { revalidatePath } from 'next/cache'

export const deleteHand = async (prevState: any, formData: FormData) => {
	const { accessToken } = getAuthData()
	const handId = formData.get('handId') as string

	const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/hand/${handId}`, {
		method: 'DELETE',
		headers: {
			Authorization: `Bearer ${accessToken}`,
		},
	})

	if (res.status === 200) {
		// revalidate all except current page, redirect on client
		revalidatePath('/my-hands')
		revalidatePath('/')
		return {
			success: 'Hand deleted successfully. Redirecting to My Hands...',
			error: '',
		}
	} else {
		console.error(res)
		try {
			const data = await res.json()
			console.error(data.message)
			return {
				success: '',
				error: `Error: ${data.message}`,
			}
		} catch {
			return {
				success: '',
				error: `Error: ${res.status} - ${res.statusText}`,
			}
		}
	}
}
