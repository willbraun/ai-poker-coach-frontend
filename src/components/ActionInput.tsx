import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useFormContext } from 'react-hook-form'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { FC } from 'react'
import { handleNumberBlur, handleNumberChange, isZeroBet } from '@/lib/utils'

interface ActionInputProps {
	selector: string
	player: number
	disabled: boolean
}

const ActionInput: FC<ActionInputProps> = ({ selector, player, disabled }) => {
	const { setValue, watch, control } = useFormContext()
	const decision: string = watch(`${selector}.decision`)
	const position: string = watch('position')

	const identifier = player === Number(position) ? `you (player ${player})` : `player ${player}`

	const onDecisionChange = (value: string) => {
		setValue(`${selector}.decision`, value)
		if (isZeroBet(value)) {
			setValue(`${selector}.bet`, '0')
		}
	}

	return (
		<div className={`duration-100 ${!disabled && 'bg-blue-200 scale-105 rounded-xl p-4 border-1 border-black'}`}>
			<FormLabel>{`What did ${identifier} do?`}</FormLabel>
			<div className='mt-4 grid grid-rows-1 grid-cols-2 gap-4'>
				<div>
					<p className='mb-2'>Action</p>
					<FormField
						control={control}
						name={`${selector}.decision`}
						render={() => (
							<FormItem>
								<Select onValueChange={onDecisionChange} disabled={disabled}>
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
									<Input
										{...field}
										type='text'
										inputMode='numeric'
										onChange={e => handleNumberChange(e, field.onChange)}
										onBlur={e => handleNumberBlur(e, field.onChange)}
										disabled={disabled || isZeroBet(decision)}
									/>
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
