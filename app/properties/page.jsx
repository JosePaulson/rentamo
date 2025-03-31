import PropertyCard from '@/components/PropertyCard';
import { fetchProperties } from '@/utils/requests';

const PropertiesPage = async () => {

	let properties = await fetchProperties()
	properties.sort((a, b) => (new Date(b.createdAt) - new Date(a.createdAt)))

	return (
		<section className=''>
			<div className='px-5 py-8 m-auto container-xl lg:container'>
				{properties.length === 0 ? (
					<p>No properties found</p>
				) : (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{properties.map((property, index) => (
							<PropertyCard property={property} key={index} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default PropertiesPage;