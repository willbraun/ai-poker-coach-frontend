import Header from '@/components/Header'
import { FC } from 'react'

const MainLayout: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<>
			<Header />
			{children}
		</>
	)
}

export default MainLayout
