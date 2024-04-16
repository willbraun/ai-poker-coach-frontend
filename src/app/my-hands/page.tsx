import Header from '@/components/Header'
import HandList from '@/components/HandList'
import MyHands from '@/components/MyHands'

const MyHandsPage = async () => {
	return (
		<>
			<Header />
			<HandList>
				<MyHands />
			</HandList>
		</>
	)
}

export default MyHandsPage
