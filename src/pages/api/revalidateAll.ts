import { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
	try {
		await Promise.all([res.revalidate('/'), res.revalidate('/my-hands')])
		return res.json({ revalidated: true })
	} catch (error) {
		console.log(error)
		return res.status(500).json({ error: 'Error revalidating', details: JSON.stringify(error) })
	}
}
