'use client'

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import linkedin from './../lib/images/icons/linkedin.svg'
import github from './../lib/images/icons/github.svg'

const Footer = () => {
	const pathName = usePathname()
	const showFooter = pathName !== '/new-hand'

	return (
		<>
			{showFooter && (
				<footer className='flex w-full items-center justify-center gap-4 p-4'>
					<p className='font-semibold' style={{ color: 'hsl(0, 0%, 50%)' }}>
						Will Braun
					</p>
					<Link href='https://www.linkedin.com/in/williamhbraun/' target='_blank' rel='noopener noreferrer'>
						<Image src={linkedin} alt='linkedin' width={20} height={20} />
					</Link>
					<Link href='https://github.com/willbraun' target='_blank' rel='noopener noreferrer'>
						<Image src={github} alt='github' width={20} height={20} />
					</Link>
				</footer>
			)}
		</>
	)
}

export default Footer
