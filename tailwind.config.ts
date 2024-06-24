import type { Config } from 'tailwindcss'

const config = {
	darkMode: ['class'],
	content: ['./pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './app/**/*.{ts,tsx}', './src/**/*.{ts,tsx}'],
	prefix: '',
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px',
			},
		},
		extend: {
			borderWidth: {
				'1': '1px',
			},
			colors: {
				'pure-red': '#ff0000',
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))',
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))',
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))',
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))',
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))',
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))',
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))',
				},
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)',
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				collapse: {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' },
				},
				expand: {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				glowBoxHighlight: {
					'0%': { opacity: '0', left: '0' },
					'5%, 15%': { opacity: '1' },
					'20%': { opacity: '0', left: '100%', transform: 'translateX(-100%)' },
				},
				scrollLeft: {
					'0%': { transform: 'translateX(0)' },
					'100%': { transform: 'translateX(-100%)' },
				},
				fadeIn: {
					from: { opacity: '0' },
					to: { opacity: '1' },
				},
				fadeUp: {
					'0%': { opacity: '1' },
					'25%': { opacity: '0', transform: 'translateY(0)' },
					'35%': { opacity: '0', transform: 'translateY(20%)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				fadeDown: {
					'0%': { opacity: '1' },
					'25%': { opacity: '0', transform: 'translateY(0)' },
					'35%': { opacity: '0', transform: 'translateY(-20%)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				fadeRight: {
					'0%': { opacity: '1' },
					'25%': { opacity: '0', transform: 'translateX(0)' },
					'35%': { opacity: '0', transform: 'translateX(-20%)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				fadeLeft: {
					'0%': { opacity: '1' },
					'25%': { opacity: '0', transform: 'translateX(0)' },
					'35%': { opacity: '0', transform: 'translateX(20%)' },
					to: { opacity: '1', transform: 'translateY(0)' },
				},
				blurIn: {
					'0%': { opacity: '1' },
					'20%': { opacity: '0', filter: 'blur(0)' },
					'40%': { opacity: '0', filter: 'blur(16px)' },
					to: { opacity: '1', filter: 'blur(0)' },
				},
				scaleUp: {
					'0%': { opacity: '1' },
					'25%': { opacity: '0', transform: 'scale(1)' },
					'35%': { opacity: '0', transform: 'scale(0.8)' },
					to: { opacity: '1', transform: 'scale(1)' },
				},
				scaleDown: {
					'0%': { opacity: '1' },
					'25%': { opacity: '0', transform: 'scale(1)' },
					'35%': { opacity: '0', transform: 'scale(1.2)' },
					to: { opacity: '1', transform: 'scale(1)' },
				},
				clipIn: {
					'0%': { 'clip-path': 'polygon(0 0, 100% 0, 100% 0, 0 0)' },
					'100%': { 'clip-path': 'polygon(0 0, 100% 0, 100% 100%, 0 100%)' },
				},
				slowSpin: {
					'0%': { transform: 'rotate(0deg)' },
					'100%': { transform: 'rotate(360deg)' },
				},
				scalePulse: {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.1)' },
				},
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				collapse: 'collapse 400ms cubic-bezier(1, 0, 0.25, 1)',
				expand: 'expand 400ms cubic-bezier(1, 0, 0.25, 1)',
				glowBoxHighlight: 'glowBoxHighlight 5s linear infinite',
				scrollLeft: 'scrollLeft var(--marquee-duration) linear infinite',
				fadeIn: 'fadeIn 500ms linear',
				fadeUp: 'fadeUp 2000ms cubic-bezier(0.25,1,0.5,1)',
				fadeDown: 'fadeDown 2000ms cubic-bezier(0.25,1,0.5,1)',
				fadeLeft: 'fadeLeft 2000ms cubic-bezier(0.25,1,0.5,1)',
				fadeRight: 'fadeRight 2000ms cubic-bezier(0.25,1,0.5,1)',
				blurIn: 'blurIn 1800ms linear',
				scaleUp: 'scaleUp 2000ms cubic-bezier(0.25,1,0.5,1)',
				scaleDown: 'scaleDown 2000ms cubic-bezier(0.25,1,0.5,1)',
				clipIn: 'clipIn 1s ease-out forwards',
				slowSpin: 'slowSpin 3s linear infinite',
				scalePulse: 'scalePulse 1s ease-in-out infinite',
			},
		},
	},
	plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
