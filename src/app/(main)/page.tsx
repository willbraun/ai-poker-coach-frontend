import AllHands from '@/components/AllHands'
import HandList from '@/components/HandList'
import TypographyH1 from '@/components/ui/typography/TypographyH1'

const Home = async () => {
	return (
		<HandList>
			<TypographyH1 className='ml-4 my-4 lg:mt-4 lg:mb-8 lg:ml-0'>All Hands</TypographyH1>
			<AllHands />
		</HandList>
	)
}

export default Home
