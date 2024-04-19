import HandList from '@/components/HandList'
import MyHands from '@/components/MyHands'
import TypographyH1 from '@/components/ui/typography/TypographyH1'

const MyHandsPage = async () => {
	return (
		<HandList>
			<TypographyH1 className='ml-4 my-4 lg:mt-4 lg:mb-8 lg:ml-0'>My Hands</TypographyH1>
			<MyHands />
		</HandList>
	)
}

export default MyHandsPage
