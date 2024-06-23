'use client'

import { Plus } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FC } from 'react'

const NewHandLink: FC = () => {
	const pathName = usePathname()

	const handleReload = (e: React.MouseEvent) => {
		if (pathName === '/new-hand') {
			e.preventDefault()
			location.reload()
		}
	}

	return (
		<Link href='/new-hand' onClick={handleReload} className='ml-auto hover:bg-slate-200 rounded-full p-1'>
			<div className='flex gap-2 items-center px-2'>
				<p className='hidden md:block'>New Hand</p>
				<Plus size='32px' />
			</div>
		</Link>
	)
}

export default NewHandLink
