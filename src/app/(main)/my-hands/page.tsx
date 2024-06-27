import HandList from '@/components/HandList'
import MyHands from '@/components/MyHands'
import TypographyH1 from '@/components/ui/typography/TypographyH1'
import { FC } from 'react'

const MyHandsPage: FC = async () => {
	return (
		<HandList>
			<TypographyH1 className='my-4 ml-4 lg:mt-8'>My Hands</TypographyH1>
			<MyHands />
		</HandList>
	)
}

export default MyHandsPage
