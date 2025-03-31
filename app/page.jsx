import Hero from '@/components/Hero'
import InfoBoxes from '@/components/InfoBoxes'
import PropertyCard from '@/components/PropertyCard'
import { fetchProperties } from '@/utils/requests'
import React from 'react'

const HomePage = async () => {
	let recentProperties = await fetchProperties()
	recentProperties = recentProperties.sort(() => Math.random() - Math.random()).slice(0, 3)
	return (
		<>
			<Hero />
			<InfoBoxes />
			<section className='px-4 py-6'>
				<div className='m-auto container-xl lg:container'>
					<h2 className='mt-3 mb-6 text-3xl font-bold text-center text-black'>
						Recent Properties
					</h2>
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{recentProperties.map((property, index) => (
							<PropertyCard property={property} key={index} />
						))}
					</div>
				</div>
			</section>
		</>
	)
}

export default HomePage