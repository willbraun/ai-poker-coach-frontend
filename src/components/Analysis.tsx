import { cn } from '@/lib/utils'
import { FC } from 'react'

interface AnalysisProps {
	analysis: string
	className?: string
}

const Analysis: FC<AnalysisProps> = ({ analysis, className }) => {
	return (
		<div className={cn('flex flex-col gap-4 rounded bg-stone-200 p-4 font-serif sm:text-lg lg:text-xl', className)}>
			{analysis.split('\\n').map((paragraph, i) => (
				<p key={i}>{paragraph}</p>
			))}
		</div>
	)
}

export default Analysis
