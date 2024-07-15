import AllHands from '@/components/AllHands'
import HandList from '@/components/HandList'
import TypographyH1 from '@/components/ui/typography/TypographyH1'
import { FC } from 'react'

const Feed: FC = () => {
	return (
		<HandList>
			<TypographyH1 className='my-4 ml-4 lg:mt-8'>All Hands</TypographyH1>
			<AllHands />
		</HandList>
	)
}

export default Feed
