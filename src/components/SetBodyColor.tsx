'use client'

import { usePathname } from 'next/navigation'
import { useEffect } from 'react'

const SetBodyColor = () => {
	const pathname = usePathname()
	useEffect(() => {
		if (pathname.startsWith('/hand/') && pathname.length === 42)
			document.getElementById('body')?.classList.add('bg-white')
		else {
			document.getElementById('body')?.classList.remove('bg-white')
		}
	}, [pathname])

	return null
}

export default SetBodyColor
