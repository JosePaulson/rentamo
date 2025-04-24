'use client'
import LoadingPage from '@/app/loading'
import PropertyCard from '@/components/PropertyCard'
import PropertySearch from '@/components/PropertySearch'
import { useSearchParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
const SearchResultsPage = () => {
	const searchParams = useSearchParams()
	const location = searchParams.get('location')
	const propertyType = searchParams.get('propertyType')

	const [properties, setProperties] = useState()
	const [isLoading, setIsLoading] = useState(true)
	useEffect(() => {
		async function fetchSearchResutls() {
			setIsLoading(true)
			try {
				const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/search?location=${location}&propertyType=${propertyType}`)
				if (res.status == 200) {
					const data = await res.json()
					setProperties(data)
				} else {
					setProperties([])
				}
			} catch (error) {
				console.log(error)
			} finally {
				setIsLoading(false)
			}
		}

		fetchSearchResutls()
	}, [location, propertyType])

	return (
		<div>
			<div className='pt-2 pb-4 bg-green-700 border-t-[1px] border-[#f2f2f233] px-5'>
				<PropertySearch />
			</div>
			{isLoading ? <LoadingPage loading={isLoading} /> : <div className='min-h-screen px-5 py-8 m-auto container-xl lg:container'>
				{properties.length === 0 ?
					<p>No properties found</p>
					:
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{properties.map((property, index) => (
							<PropertyCard property={property} key={index} />
						))}
					</div>
				}
			</div>}
		</div>
	)
}

export default SearchResultsPage