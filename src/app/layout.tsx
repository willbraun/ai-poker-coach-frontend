import type { Metadata } from 'next'
import './globals.css'
import GetAuth from './_GetAuth'

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
			<body>{children}</body>
			<GetAuth />
		</html>
	)
}
