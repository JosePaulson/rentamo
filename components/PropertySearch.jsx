'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'

const PropertySearch = () => {
	const [location, setLocation] = useState('')
	const [propertyType, setPropertyType] = useState('All')

	const router = useRouter()

	async function handleSubmit(e) {
		e.preventDefault()
		if (location == '' && propertyType == 'All') {
			router.push('/properties')
		} else {
			router.push(`/properties/search-results?location=${location}&propertyType=${propertyType}`)
		}
	}
	return (
		<form onSubmit={handleSubmit} className='flex flex-col items-center w-full max-w-2xl mx-auto mt-3 md:flex-row'>
			<div className='w-full mb-4 md:w-3/5 md:pr-2 md:mb-0'>
				<label htmlFor='location' className='sr-only'>
					Location
				</label>
				<input
					type='text'
					id='location'
					placeholder='Enter Location or Keyword'
					onChange={(e) => setLocation(e.target.value)}
					value={location}
					className='w-full px-4 py-3 text-gray-800 bg-white rounded-lg focus:outline-none focus:ring focus:ring-green-500'
				/>
			</div>
			<div className='w-full md:w-2/5 md:pl-2'>
				<label htmlFor='property-type' className='sr-only'>
					Property Type
				</label>
				<select
					value={propertyType}
					onChange={(e) => setPropertyType(e.target.value)}
					id='property-type'
					className='w-full px-4 py-3 text-gray-800 bg-white rounded-lg focus:outline-none focus:ring focus:ring-green-500'
				>
					<option value='All'>All</option>
					<option value='Apartment'>Apartment</option>
					<option value='Studio'>Studio</option>
					<option value='Condo'>Condo</option>
					<option value='House'>House</option>
					<option value='Cabin Or Cottage'>Cabin or Cottage</option>
					<option value='Loft'>Loft</option>
					<option value='Room'>Room</option>
					<option value='Other'>Other</option>
				</select>
			</div>
			<button
				type='submit'
				className='w-full px-6 py-3 mt-4 text-white bg-black rounded-lg md:ml-4 md:mt-0 md:w-auto hover:bg-[#000a] focus:outline-none focus:ring focus:ring-green-500'
			>
				Search
			</button>
		</form>
	)
}

export default PropertySearch