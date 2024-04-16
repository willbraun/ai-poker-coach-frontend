const HandList = ({ children }: { children: React.ReactNode }) => {
	return (
		<main className='pt-16 w-full'>
			<div className='max-w-screen-md mx-auto py-2 md:py-4'>{children}</div>
		</main>
	)
}

export default HandList
