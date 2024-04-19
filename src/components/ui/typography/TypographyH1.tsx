import { cn } from '@/lib/utils'

const TypographyH1 = ({ children, className }: { children: React.ReactNode; className?: string }) => {
	return <h1 className={cn('scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl', className)}>{children}</h1>
}

export default TypographyH1
