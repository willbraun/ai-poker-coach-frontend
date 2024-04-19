const HandList = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className='pt-16 w-full'>
			<div className='max-w-screen-lg mx-auto py-2 lg:py-4'>{children}</div>
		</main>
	)
}

export default HandList
