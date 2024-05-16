import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import { useFormContext } from 'react-hook-form'

interface ActionInputProps {
	selector: string
	player: number
}

const ActionInput = ({ selector, player }: ActionInputProps) => {
	const { setValue, watch, control } = useFormContext()
	const decision = watch(`${selector}.decision`)

	console.log(watch(`${selector}.bet`))

	const onChange = (value: string) => {
		setValue(`${selector}.decision`, value ?? 0)
		if (['0', '1'].includes(value)) {
			setValue(`${selector}.bet`, 0)
		}
	}

	return (
		<div>
			<FormLabel>{`What did player ${player} do?`}</FormLabel>
			<div className='mt-4 grid grid-rows-1 grid-cols-2'>
				<div>
					<FormControl>
						<RadioGroup onValueChange={onChange} defaultValue={'0'} className='flex flex-col space-y-1'>
							<FormItem className='flex items-center space-x-3 space-y-0'>
								<FormControl>
									<RadioGroupItem value='0' />
								</FormControl>
								<p className='font-normal'>Fold</p>
							</FormItem>
							<FormItem className='flex items-center space-x-3 space-y-0'>
								<FormControl>
									<RadioGroupItem value='1' />
								</FormControl>
								<p className='font-normal'>Check</p>
							</FormItem>
							<FormItem className='flex items-center space-x-3 space-y-0'>
								<FormControl>
									<RadioGroupItem value='2' />
								</FormControl>
								<p className='font-normal'>Call</p>
							</FormItem>
							<FormItem className='flex items-center space-x-3 space-y-0'>
								<FormControl>
									<RadioGroupItem value='3' />
								</FormControl>
								<p className='font-normal'>Bet</p>
							</FormItem>
							<FormItem className='flex items-center space-x-3 space-y-0'>
								<FormControl>
									<RadioGroupItem value='4' />
								</FormControl>
								<p className='font-normal'>Raise</p>
							</FormItem>
							<FormItem className='flex items-center space-x-3 space-y-0'>
								<FormControl>
									<RadioGroupItem value='5' />
								</FormControl>
								<p className='font-normal'>Call (all-in)</p>
							</FormItem>
							<FormItem className='flex items-center space-x-3 space-y-0'>
								<FormControl>
									<RadioGroupItem value='6' />
								</FormControl>
								<p className='font-normal'>Bet (all-in)</p>
							</FormItem>
						</RadioGroup>
					</FormControl>
				</div>
				<div>
					<p className='mb-2'>Bet Size</p>
					<FormField
						control={control}
						name={`${selector}.bet`}
						defaultValue={0}
						disabled={[0, 1].includes(parseInt(decision))}
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Input {...field} type='number' />
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
