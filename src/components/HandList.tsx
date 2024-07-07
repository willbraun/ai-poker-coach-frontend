import { FC } from 'react'

const HandList: FC<{ children: React.ReactNode }> = ({ children }) => {
	return (
		<main className='mt-16 w-full'>
			<div className='mx-auto flex max-w-screen-lg flex-col gap-2 lg:gap-4'>{children}</div>
		</main>
	)
}

export default HandList
