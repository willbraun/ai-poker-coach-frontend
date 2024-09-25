import { FC, ReactNode } from 'react'
import { Metadata } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
	title: 'AI Poker Coach',
	description: 'Poker advice in English, not charts',
}

const RootLayout: FC<{ children: ReactNode }> = ({ children }) => {
	return (
		<html lang='en'>
			<body id='body'>
				{children}
				<Script
					src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
					strategy='afterInteractive'
				/>
				<Script id='google-analytics' strategy='afterInteractive'>
					{`
						window.dataLayer = window.dataLayer || [];
						function gtag(){dataLayer.push(arguments);}
						gtag('js', new Date());
						gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
					`}
				</Script>
			</body>
		</html>
	)
}

export default RootLayout
