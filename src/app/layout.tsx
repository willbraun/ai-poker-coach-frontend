import SetBodyColor from '@/components/SetBodyColor'
import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
	title: 'AI Poker Coach',
	description: 'Created by Will Braun',
}

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang='en'>
			<body className='bg-slate-100' id='body'>
				{children}
			</body>
			<SetBodyColor />
		</html>
	)
}
