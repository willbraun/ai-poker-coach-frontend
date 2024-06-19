import { FC } from 'react'

interface FormErrorProps {
	error: string
}

const FormError: FC<FormErrorProps> = ({ error }) => {
	return <p className='text-md text-red-500 whitespace-pre-line'>{error}</p>
}

export default FormError
