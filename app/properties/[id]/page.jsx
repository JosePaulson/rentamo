'use client'
import PropertyHeaderImage from '@/components/PropertyHeaderImage'
import PropertyMap from '@/components/PropertyMap'
import Spinner from '@/components/Spinner'
import { fetchProperty } from '@/utils/requests'
import Image from 'next/image'
import Link from 'next/link'
import { useParams } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { FaArrowLeft, FaBath, FaBed, FaBookmark, FaCheck, FaMapMarker, FaPaperPlane, FaRulerCombined, FaShare, FaTimes } from 'react-icons/fa'

const propertyPage = () => {
	const [property, setProperty] = useState()
	const [isLoading, setIsLoading] = useState(true)
	const { id } = useParams()
	useEffect(() => {
		const fetchPropertyById = async (id) => {
			try {
				const property = await fetchProperty(id)
				setProperty(property)
			} catch (error) {
				console.error('Error loading property, try again')
			} finally {
				setIsLoading(false)
			}
		}

		fetchPropertyById(id)

	}, [id])

	if (!property && !isLoading)
		return (
			<h1 className='mt-10 text-2xl font-bold text-center'>
				Property Not Found
			</h1>
		);
	return (
		<>
			{isLoading && <Spinner loading={isLoading} />}
			{!isLoading && property && (
				<>
					<PropertyHeaderImage image={property.images[0]} />
					<section>
						<div className='container px-6 py-6 m-auto'>
							<Link
								href='/properties'
								className='flex items-center text-green-600 hover:text-green-700'
							>
								<FaArrowLeft className='size-4 mr-1.5' /> Back to Properties
							</Link>
						</div>
					</section>
					<section className='bg-green-50'>
						<div className='container px-6 py-10 m-auto'>
							<div className='grid w-full grid-cols-1 gap-6 md:grid-cols-70/30'>
								<main>
									<div className='p-6 text-center bg-white rounded-lg shadow-md md:text-left'>
										<div className='mb-4 text-gray-500'>{property.property_type}</div>
										<h1 className='mb-4 text-3xl font-bold'>{property.name}</h1>
										<div className='flex justify-center mb-4 text-gray-500 align-middle md:justify-start'>
											<FaMapMarker className='mr-2 text-lg text-orange-700' />
											<p className='text-orange-700'>
												{property.location.street}, {property.location.city}{' '}
												{property.location.state}
											</p>
										</div>

										<h3 className='p-2 my-6 text-lg font-bold text-white bg-gray-800'>
											Rates & Options
										</h3>
										<div className='flex flex-col justify-around md:flex-row'>
											<div className='flex items-center justify-center pb-4 mb-4 border-b border-gray-200 md:border-b-0 md:pb-0'>
												<div className='mr-2 font-bold text-gray-500'>
													Nightly
												</div>
												<div className='text-2xl font-bold'>
													{property.rates.nightly ? (
														`$${property.rates.nightly.toLocaleString()}`
													) : (
														<FaTimes className='text-red-700' />
													)}
												</div>
											</div>
											<div className='flex items-center justify-center pb-4 mb-4 border-b border-gray-200 md:border-b-0 md:pb-0'>
												<div className='mr-2 font-bold text-gray-500'>Weekly</div>
												<div className='text-2xl font-bold text-green-600'>
													{property.rates.weekly ? (
														`$${property.rates.weekly.toLocaleString()}`
													) : (
														<FaTimes className='text-red-700' />
													)}
												</div>
											</div>
											<div className='flex items-center justify-center pb-4 mb-4 md:pb-0'>
												<div className='mr-2 font-bold text-gray-500'>
													Monthly
												</div>
												<div className='text-2xl font-bold text-green-600'>
													{property.rates.monthly ? (
														`$${property.rates.monthly.toLocaleString()}`
													) : (
														<FaTimes className='text-red-700' />
													)}
												</div>
											</div>
										</div>
									</div>

									<div className='p-6 mt-6 bg-white rounded-lg shadow-md'>
										<h3 className='mb-6 text-lg font-bold'>
											Description & Details
										</h3>
										<div className='flex justify-center gap-4 mb-4 text-xl text-green-600 space-x-9'>
											<p>
												<FaBed className='inline-block mr-2' /> {property.beds}{' '}
												<span className='hidden sm:inline'>Beds</span>
											</p>
											<p>
												<FaBath className='inline-block mr-2' /> {property.baths}{' '}
												<span className='hidden sm:inline'>Baths</span>
											</p>
											<p>
												<FaRulerCombined className='inline-block mr-2' />
												{property.square_feet} <span className='hidden sm:inline'>sqft</span>
											</p>
										</div>
										<p className='mb-4 text-gray-500'>{property.description}</p>
									</div>

									<div className='p-6 mt-6 bg-white rounded-lg shadow-md'>
										<h3 className='mb-6 text-lg font-bold'>Amenities</h3>

										<ul className='grid grid-cols-1 space-y-2 list-none md:grid-cols-2 lg:grid-cols-3'>
											{property.amenities.map((amenity, index) => (
												<li key={index}>
													<FaCheck className='inline-block mr-2 text-green-600' />
													{amenity}
												</li>
											))}
										</ul>
									</div>
									<div className='p-6 mt-6 bg-white rounded-lg shadow-md'>
										<PropertyMap currentLoc={property.lngLat} />
									</div>
									{property.images.length > 1 && <div className='p-6 mt-6 bg-white rounded-lg shadow-md'>
										<div className='flex' id='map'>{property.images.filter((image, idx) => idx !== 0).map(image => <div key={image}>
											<Image width={200} height={200} src={image} alt='' />
										</div>)}</div>
									</div>}
								</main>

								{/* <!-- Sidebar --> */}
								<aside className='space-y-4'>
									<div>
										<button className='flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-green-600 rounded-full hover:bg-green-700'>
											<FaBookmark className='mr-2' />
											Bookmark Property
										</button>
									</div>
									<div>
										<button className='flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-orange-500 rounded-full hover:bg-orange-600'>
											<FaShare className='mr-2' /> Share Property
										</button>
									</div>

									{/* <!-- Contact Form --> */}
									<div className='p-6 bg-white rounded-lg shadow-md'>
										<h3 className='mb-6 text-xl font-bold'>
											Contact Property Manager
										</h3>
										<form
											action='mailto:support@traversymedia.com'
											method='post'
											encType='text/plain'
										>
											<div className='mb-4'>
												<label
													className='block mb-2 text-sm font-bold text-gray-700'
													htmlFor='email'
												>
													Email:
												</label>
												<input
													className='w-full px-3 py-2 leading-tight text-gray-700 border rounded shadow appearance-none focus:outline-none focus:shadow-outline'
													id='email'
													type='email'
													placeholder='Enter your email'
												/>
											</div>
											<div className='mb-4'>
												<label
													className='block mb-2 text-sm font-bold text-gray-700'
													htmlFor='message'
												>
													Message:
												</label>
												<textarea
													className='w-full px-3 py-2 text-gray-700 border rounded shadow appearance-none h-44 focus:outline-none focus:shadow-outline'
													id='message'
													placeholder='Enter your message'
												></textarea>
											</div>
											<div>
												<button
													className='flex items-center justify-center w-full px-4 py-2 font-bold text-white bg-green-600 rounded-full hover:bg-green-700 focus:outline-none focus:shadow-outline'
													type='submit'
												>
													<FaPaperPlane className='mr-2' /> Send Message
												</button>
											</div>
										</form>
									</div>
								</aside>
							</div>
						</div>
					</section>
				</>

			)}
		</>
	)
}

export default propertyPage