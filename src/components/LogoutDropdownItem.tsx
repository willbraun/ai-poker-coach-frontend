'use client'

import { LogOut } from 'lucide-react'
import { DropdownMenuItem } from './ui/dropdown-menu'
import logout from '@/app/(auth)/(logout)/server'
import { FC } from 'react'

const handleLogOut = async () => {
	await logout()
}

const LogoutDropdownItem: FC = () => {
	return (
		<DropdownMenuItem className='text-lg' onSelect={handleLogOut}>
			<LogOut className='mr-2 h-4 w-4' />
			<span>Log out</span>
		</DropdownMenuItem>
	)
}

export default LogoutDropdownItem
