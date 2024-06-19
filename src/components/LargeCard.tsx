import React, { FC } from 'react'
import SuitIcon from './SuitIcon'

type LargeCardProps = {
	value: string
	suit: string
	disabled?: boolean
}

const LargeCard: FC<LargeCardProps> = ({ value, suit, disabled = false }) => {
	const valueStyle = `text-3xl font-bold text-left ${['D', 'H'].includes(suit) && 'text-pure-red'} ${
		['6', '9'].includes(value) && 'underline decoration-2 underline-offset-4'
	}`
	const displayValue = value === 'T' ? '10' : value

	return (
		<div
			className={`w-24 h-36 grid grid-rows-3 grid-cols-1 gap-2 border-1 border-grey bg-white p-2 rounded-lg shadow duration-100 ${
				!disabled && 'hover:scale-105'
			}`}
		>
			<p className={`${valueStyle}`}>{displayValue}</p>
			<div className='mx-auto w-1/2'>
				<SuitIcon suit={suit} />
			</div>
			<p className={`rotate-180 ${valueStyle}`}>{displayValue}</p>
		</div>
	)
}

export default LargeCard
