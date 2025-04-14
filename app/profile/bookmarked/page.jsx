'use client'
import PropertyCard from '@/components/PropertyCard';
import Loader from '@/app/loading';
import { fetchSavedProperties, toggleBookmark } from '@/utils/requests';
import { useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const savedPropertiesPage = () => {
	const [properties, setProperties] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const [isLoadingUnsave, setIsLoadingUnsave] = useState(false)
	const [reload, setReload] = useState(false)
	const { data: session } = useSession()
	useEffect(() => {
		async function fetchBookmarks(userId) {
			try {
				setIsLoading(true)
				const savedProperties = await fetchSavedProperties(userId)
				setProperties(savedProperties)
			} catch (error) {
				console.error('Error loading property, try again')
			} finally {
				setIsLoading(false)
			}
		}

		if (session && session?.user?.id) {
			fetchBookmarks(session.user.id)
		}
	}, [session, reload])

	async function handleBookmark(propertyId) {
		setIsLoadingUnsave(true)
		const { message } = await toggleBookmark(propertyId)
		setReload(!reload)
		toast(message)
		setIsLoadingUnsave(false)
	}

	return (
		<section className=''>
			<div className='min-h-screen px-5 py-8 m-auto container-xl lg:container'>
				{isLoading && <Loader loading={isLoading} />}
				{!isLoading && properties.length === 0 ? (
					<p>No properties found</p>
				) : (
					<div className='grid grid-cols-1 gap-6 md:grid-cols-3'>
						{properties.map((property, index) => (
							<PropertyCard isLoadingUnsave={isLoadingUnsave} handleUnsave={handleBookmark} property={property} key={index} />
						))}
					</div>
				)}
			</div>
		</section>
	);
};

export default savedPropertiesPage;