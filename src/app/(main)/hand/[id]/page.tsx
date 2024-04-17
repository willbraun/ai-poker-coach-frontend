import { UUID } from 'crypto'

const Hand = ({ params }: { params: { id: UUID } }) => {
	return <div className='mt-24'>Hand with ID: {params.id}</div>
}

export default Hand
