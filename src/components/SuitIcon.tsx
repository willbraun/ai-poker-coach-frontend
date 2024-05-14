import Image from 'next/image'
import club from '@/lib/images/icons/club.svg'
import diamond from '@/lib/images/icons/diamond.svg'
import heart from '@/lib/images/icons/heart.svg'
import spade from '@/lib/images/icons/spade.svg'

const suitMap: Record<string, JSX.Element> = {
	C: <Image src={club} alt={'club'} />,
	D: <Image src={diamond} alt={'diamond'} />,
	H: <Image src={heart} alt={'heart'} />,
	S: <Image src={spade} alt={'spade'} />,
}

const SuitIcon = ({ suit }: { suit: string }) => {
	return <>{suitMap[suit]}</>
}

export default SuitIcon
