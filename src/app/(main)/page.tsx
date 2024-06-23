import AllHands from '@/components/AllHands'
import HandList from '@/components/HandList'
import TypographyH1 from '@/components/ui/typography/TypographyH1'
import { FC } from 'react'

const Home: FC = async () => {
	return (
		<HandList>
			<TypographyH1 className='my-4 ml-4 lg:mb-8 lg:ml-0 lg:mt-4'>All Hands</TypographyH1>
			<AllHands />
		</HandList>
	)
}

export default Home
