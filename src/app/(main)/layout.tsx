import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { FC } from 'react'

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<>
			<Header />
			<div className='flex min-h-full flex-col justify-between'>
				{children}
				<Footer textColor='text-gray-500' iconFill='fill-gray-500' />
			</div>
		</>
	)
}

export default MainLayout
