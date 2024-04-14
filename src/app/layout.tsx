import type { Metadata } from 'next'
import './globals.css'
import GetAuth from '../components/GetAuth'

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
			<body className='bg-slate-100'>{children}</body>
			<GetAuth />
		</html>
	)
}
