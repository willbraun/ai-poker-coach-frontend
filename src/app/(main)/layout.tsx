import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { FC } from 'react'

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<>
			<Header />
			<div className='flex min-h-full flex-col justify-between'>
				{children}
				<Footer />
			</div>
		</>
	)
}

export default MainLayout
