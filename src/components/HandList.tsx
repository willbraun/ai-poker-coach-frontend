import { FC } from 'react'

const HandList: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<main className='w-full pt-16'>
			<div className='mx-auto max-w-screen-lg py-2 lg:py-4'>{children}</div>
		</main>
	)
}

export default HandList
