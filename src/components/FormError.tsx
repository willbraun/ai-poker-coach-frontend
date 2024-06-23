import { FC } from 'react'

interface FormErrorProps {
	error: string
}

const FormError: FC<FormErrorProps> = ({ error }) => {
	return <p className='text-md whitespace-pre-line text-red-500'>{error}</p>
}

export default FormError
