import HandList from '@/components/HandList'
import MyHands from '@/components/MyHands'

const MyHandsPage = async () => {
	return (
		<HandList>
			<h1 className='text-2xl mt-2 md:mt-0 mb-4 ml-6'>My Hands</h1>
			<MyHands />
		</HandList>
	)
}

export default MyHandsPage
