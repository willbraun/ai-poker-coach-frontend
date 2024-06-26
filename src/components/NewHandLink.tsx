'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'
import { Button } from './ui/button'

const NewHandLink: FC = () => {
	const pathName = usePathname()

	const handleReload = (e: React.MouseEvent) => {
		if (pathName === '/new-hand') {
			e.preventDefault()
			location.reload()
		}
	}

	return (
		<Button onClick={handleReload}>
			<Link href='/new-hand'>
				<div className='flex items-center gap-2 px-2'>
					<p className='hidden md:block'>New Hand</p>
					<Plus size='32px' />
				</div>
			</Link>
		</Button>
	)
}

export default NewHandLink
