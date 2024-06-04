'use client'
import { useParams, usePathname, useRouter, useSearchParams } from 'next/navigation'
import React from 'react'

const propertyPage = () => {
	const router = useRouter()
	const { id } = useParams()
	const searchParams = useSearchParams()
	const name = searchParams.get('name')
	const path = usePathname()
	return (
		<div>
			<div>propertyPage</div>
			<span className='cursor-pointer' onClick={() => router.push('/')} href={'/'}>Home {id} {name} {path}</span>
		</div>
	)
}

export default propertyPage