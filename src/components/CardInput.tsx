import { Input } from '@/components/ui/input'
import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form'
import { useFormContext } from 'react-hook-form'

const CardInput = ({ cardIndex, name }: { cardIndex: number; name: string }) => {
	const { control } = useFormContext()

	return (
		<FormField
			control={control}
			name={`${name}.cards.${cardIndex}`}
			render={({ field }) => (
				<FormItem>
					<FormControl>
						<Input {...field} />
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	)
}

export default CardInput
