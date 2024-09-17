import { revalidatePath } from 'next/cache'

export async function POST() {
	try {
		revalidatePath('/', 'layout')
		return Response.json({ revalidated: true })
	} catch (error) {
		console.error(error)
		return new Response('Error revalidating', {
			status: 500,
		})
	}
}
