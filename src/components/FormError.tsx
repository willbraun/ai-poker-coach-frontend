interface FormErrorProps {
	error: string
}

const FormError = ({ error }: FormErrorProps) => {
	return <p className='text-md text-red-500 whitespace-pre-line'>{error}</p>
}

export default FormError
