'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import profileDefault from '@/public/images/profile.png'
import { useEffect, useState } from 'react';
import { deleteUserProperty, fetchUserProperties } from '@/utils/requests';
import Spinner from '@/components/Spinner';


const ProfilePage = () => {
	const [properties, setProperties] = useState([])
	const [isLoading, setIsLoading] = useState(true)
	const { data: session } = useSession()

	const profileImage = session?.user?.image
	const profileName = session?.user?.name
	const profileEmail = session?.user?.email
	const userId = session?.user?.id

	useEffect(() => {
		async function fetchPropertiesByUserId(userId) {
			try {
				const userProperties = await fetchUserProperties(userId)
				setProperties(userProperties)
			} catch (error) {
				console.error('Error loading property, try again')
			} finally {
				setIsLoading(false)
			}
		}

		if (session && session?.user?.id) {
			fetchPropertiesByUserId(userId)
		}
	}, [session])

	async function handleDelete(propertyId) {
		const confirmed = window.confirm('Are you sure to delete this property?')

		if (!confirmed) return
		const res = await deleteUserProperty(propertyId)
		if (res && res.ok) {
			alert("Property deleted")
			const updatedProperties = properties.filter(property => property._id !== propertyId)
			setProperties(updatedProperties)
		} else {
			alert("Property not deleted")
		}
	}

	return (
		<section className='bg-blue-50'>
			<div className='container pt-6 m-auto md:py-12 lg:py-24'>
				<div className='px-6 py-8 m-4 mb-4 bg-white border rounded-md shadow-md md:m-0'>
					<h1 className='mb-4 text-xl font-bold lg:text-xl xl:text-2xl'>Profile Details</h1>

					<div className='flex flex-col md:flex-row'>
						<div className='mx-6 mt-5 md:w-fit lg:mt-8'>
							<div className='mb-4'>
								<Image
									className='mx-auto rounded-full size-24 lg:size-32 md:mx-0'
									src={profileImage || profileDefault}
									alt='User'
									width={200}
									height={200}
									priority={true}
								/>
							</div>

							<h2 className='mb-4 md:text-lg lg:text-xl'>
								<span className='block font-bold'>Name: </span> {profileName}
							</h2>
							<h2 className='text-lg md:text-lg lg:text-xl'>
								<span className='block font-bold'>Email: </span> {profileEmail}
							</h2>
						</div>
						<div className='flex-1 mt-5 md:pl-4'>
							<h2 className='mb-4 text-xl font-semibold'>Your Listings</h2>
							{!isLoading && properties.length === 0 && <p>There's no listing under your profile</p>}
							{isLoading ? <Spinner loading={isLoading} /> : <div className='grid grid-cols-1 gap-4 md:grid-cols-1 lg:grid-cols-3 xl:grid-cols-4'>
								{properties.map(property => (
									<div key={property._id} className='mb-10'>
										<Link href={`/properties/${property._id}`}>
											<Image
												className='object-cover w-full h-32 rounded-md'
												src={property.images[0]}
												alt='Property 2'
												width={500}
												height={100}
												priority={true}
											/>
										</Link>
										<div className='mt-2'>
											<p className='text-lg font-semibold'>{property.name}</p>
											<p className='text-gray-600'>{property.location.street}</p>
										</div>
										<div className='mt-2'>
											<Link
												href={{ pathname: '/properties/add', query: { data: JSON.stringify(property) } }}
												className='px-3 py-3 mr-2 text-white bg-green-700 rounded-md hover:bg-green-600'
											>
												Edit
											</Link>
											<button
												onClick={() => handleDelete(property._id)}
												className='px-3 py-2 text-white rounded-md bg-gray-950 hover:bg-gray-800'
												type='button'
											>
												Delete
											</button>
										</div>
									</div>
								))}
							</div>}
						</div>
					</div>
				</div>
			</div>
		</section>
	);
};
export default ProfilePage;