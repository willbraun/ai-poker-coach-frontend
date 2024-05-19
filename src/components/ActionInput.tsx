import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { ChangeEvent } from 'react'
import { isZeroBet } from '@/lib/utils'

interface ActionInputProps {
	selector: string
	player: number
}

const ActionInput = ({ selector, player }: ActionInputProps) => {
	const { setValue, watch, control } = useFormContext()
	const decision = watch(`${selector}.decision`)

	const onDecisionChange = (value: string) => {
		setValue(`${selector}.decision`, value)
		if (isZeroBet(value)) {
			setValue(`${selector}.bet`, '0')
		}
	}

	const onBetBlur = (event: ChangeEvent<HTMLInputElement>) => {
		// Regular expression to remove leading zeros only if not followed by a decimal point
		const trimmedValue = event.target.value.replace(/^0+(?!\.)/, '') || '0'
		setValue(`${selector}.bet`, trimmedValue)
	}

	return (
		<div>
			<FormLabel>{`What did player ${player} do?`}</FormLabel>
			<div className='mt-4 grid grid-rows-1 grid-cols-2 gap-4'>
				<div>
					<p className='mb-2'>Action</p>
					<FormField
						control={control}
						name={`${selector}.decision`}
						render={() => (
							<FormItem>
								<Select onValueChange={onDecisionChange}>
									<FormControl>
										<SelectTrigger className='w-full'>
											<SelectValue placeholder='Select' />
										</SelectTrigger>
									</FormControl>
									<SelectContent>
										<SelectItem value='fold'>Fold</SelectItem>
										<SelectItem value='check'>Check</SelectItem>
										<SelectItem value='call'>Call</SelectItem>
										<SelectItem value='bet'>Bet</SelectItem>
										<SelectItem value='raise'>Raise</SelectItem>
										<SelectItem value='callAllIn'>Call (all-in)</SelectItem>
										<SelectItem value='betAllIn'>Bet (all-in)</SelectItem>
									</SelectContent>
								</Select>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
				<div>
					<p className='mb-2'>Bet Size</p>
					<FormField
						control={control}
						name={`${selector}.bet`}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} type='number' onBlur={onBetBlur} disabled={isZeroBet(decision)} />
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
				</div>
			</div>
		</div>
	)
}

export default ActionInput
