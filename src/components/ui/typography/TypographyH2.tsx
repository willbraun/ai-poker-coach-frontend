import { cn } from '@/lib/utils'

const TypographyH2 = ({ children, className }: { children: React.ReactNode; className?: string }) => {
	return <h2 className={cn('scroll-m-20 pb-2 text-3xl font-semibold tracking-tight', className)}>{children}</h2>
}

export default TypographyH2
