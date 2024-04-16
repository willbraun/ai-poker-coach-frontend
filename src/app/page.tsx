import Header from '../components/Header'
import HandList from '@/components/HandList'
import AllHands from '@/components/AllHands'

const Home = async () => {
	return (
		<>
			<Header />
			<HandList>
				<AllHands/>
			</HandList>
		</>
	)
}

export default Home
