import Footer from '@/components/Footer'
import Header from '@/components/Header'
import { FC } from 'react'

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<>
			<Header />
			{children}
			<Footer />
		</>
	)
}

export default MainLayout
