import React from 'react'
import SuitIcon from './SuitIcon'

type LargeCardProps = {
	value: string
	suit: string
}

const LargeCard: React.FC<LargeCardProps> = ({ value, suit }) => {
	const valueStyle = `text-3xl font-bold text-left ${['D', 'H'].includes(suit) && 'text-pure-red'}`
	const displayValue = value === 'T' ? '10' : value

	return (
		<div className='w-24 h-36 grid grid-rows-3 grid-cols-1 gap-2 border-1 border-grey bg-white p-2 rounded-lg shadow hover:scale-105 duration-100'>
			<p className={`${valueStyle}`}>{displayValue}</p>
			<div className='flex justify-center scale-150'>
				<SuitIcon suit={suit} />
			</div>
			<p className={`rotate-180 ${valueStyle}`}>{displayValue}</p>
		</div>
	)
}

export default LargeCard
