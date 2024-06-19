'use client'

import { FC, useEffect } from 'react'

const ScrollToTop: FC = () => {
	useEffect(() => {
		window.scrollTo(0, 0)
	}, [])
	return null
}

export default ScrollToTop
