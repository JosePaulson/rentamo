'use client'
import PropertyCard from '@/components/PropertyCard';
import { fetchProperties } from '@/utils/requests';
import { useEffect, useState } from 'react';
import LoadingPage from '../loading';
const PropertiesPage = () => {
	const [properties, setProperties] = useState()
	const [propertiesCopy, setPropertiesCopy] = useState()
	const [isLoading, setIsLoading] = useState(true)
	const initialValue = {
		property_type: '',
		beds: '',
		'location.city': ''
	}
	const [query, setQuery] = useState(initialValue)

	function handleSearchChange(e) {
		const { id, value } = e.target
		setQuery(prev => ({
			...prev,
			[id]: value
		}))
	}

	async function handleSearch(e) {
		e.preventDefault()
		setIsLoading(true)
		if (!query.property_type && !query.beds && !query['location.city']) {
			setProperties(propertiesCopy)
			setIsLoading(false)
			return
		}
		try {
			const res = await fetch(`${process.env.NEXT_PUBLIC_API_DOMAIN}/properties/search?queryString=${JSON.stringify(query)}`)
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

	useEffect(() => {
		async function fetchAllProperties() {
			setIsLoading(true)
			const properties = await fetchProperties()
			setProperties(properties)
			setPropertiesCopy(properties)
			setIsLoading(false)
		}

		fetchAllProperties()
	}, [])

	let cities = []
	let types = []
	if (propertiesCopy?.length > 0) {
		propertiesCopy.forEach(property => cities.push(property.location.city.toLowerCase()))
		cities = Array.from(new Set(cities))
		propertiesCopy.forEach(property => types.push(property.property_type.toLowerCase()))
		types = Array.from(new Set(types))
		propertiesCopy.sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)))
	}

	return (
		isLoading ? <LoadingPage loading={isLoading} /> : <section className='px-5 mx-auto container-xl lg:container'>
			<form onSubmit={handleSearch} className='flex justify-end gap-5 px-5 pt-4 pb-2 text-gray-800'>
				<select defaultValue={query['location.city']} onChange={handleSearchChange} className={`capitalize px-2 py-3 bg-green-50 focus:ring-2 focus:ring-green-400 focus:border-green-700 rounded-lg w-[10rem] indent-2 border-[1px] border-green-700 shadow-md ${query['location.city'] == '' ? 'text-gray-400' : 'text-gray-900'}`} name="" id="location.city">
					<option value=''>City</option>
					{cities.length > 0 && cities.map(city => (<option key={city} className='text-gray-900 capitalize' value={city}>{city}</option>))}
				</select>
				<select defaultValue={query.beds} onChange={handleSearchChange} className={`capitalize px-2 py-3 bg-green-50 focus:ring-2 focus:ring-green-400 focus:border-green-700 rounded-lg w-[10rem] indent-2 border-[1px] border-green-700 shadow-md ${query['beds'] == '' ? 'text-gray-400' : 'text-gray-900'}`} name="" id="beds">
					<option value=''>Bed</option>
					{[1, 2, 3, 4].map(bed => (<option key={bed} className='text-[.9rem] text-gray-900' value={bed}>{bed + ' BHK'}</option>))}
				</select>
				<select defaultValue={query.property_type} onChange={handleSearchChange} className={`capitalize px-2 py-3 bg-green-50 focus:ring-2 focus:ring-green-400 focus:border-green-700 rounded-lg w-[10rem] indent-2 border-[1px] border-green-700 shadow-md ${query['property_type'] == '' ? 'text-gray-400' : 'text-gray-900'}`} name="" id="property_type">
					<option value=''>Type</option>
					{types.length > 0 && types.map(type => (<option key={type} className='capitalize text-[.9rem] text-gray-900' value={type}>{type}</option>))}
				</select>
				<button className='px-5 py-2 bg-black text-gray-200 rounded-lg capitalize w-fit border-[1px] border-black shadow-md hover:bg-gray-800'>
					Search
				</button>
				<button onClick={() => { setProperties(propertiesCopy); setQuery(initialValue) }} type='button' className='-ml-2 px-5 py-2 bg-green-700 text-gray-200 rounded-lg capitalize w-fit border-[1px] border-green-700 shadow-md hover:bg-green-800'>
					Clear
				</button>
			</form>
			<div className='py-4 pb-8'>
				{properties?.length === 0 ? (
					<p>No properties found</p>
				) : (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{properties?.length > 0 && properties.map((property, index) => (
							<PropertyCard property={property} key={index} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default PropertiesPage;