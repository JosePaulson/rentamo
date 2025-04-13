'use client'
import Image from "next/image"
import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Spinner from "./Spinner"
import { AiFillCloseCircle } from "react-icons/ai";
import PropertyMap from "./PropertyMap"

const PropertyAddForm = ({ state = null }) => {
	const router = useRouter()

	const [isLoading, setIsLoading] = useState(false)
	const [cloudImgs, setCloudImgs] = useState([])
	const [lngLat, setLngLat] = useState()
	console.log(lngLat)

	const [fields, setFields] = useState({
		property_type: 'Apartment',
		name: 'Test Property',
		description: 'An Apartment',
		location: {
			street: '31 west, palm retreat',
			city: 'los angeles',
			state: 'california',
			zipcode: '345235',
		},
		beds: '3',
		baths: '2',
		square_feet: '2000',
		amenities: ['Wifi', 'Hot Tub'],
		rates: {
			weekly: 899,
			monthly: 2999,
			nightly: 199,
		},
		seller: {
			seller_name: 'Paul Jose',
			seller_email: 'paul@rentamo.com',
			seller_phone: '9876543210',
		},
		images: [],
	})

	useEffect(() => {
		if (state !== null) {
			setFields({ ...state, images: [] })
			setCloudImgs([...state.images])
		}
	}, [state])

	function handleChange(e) {
		const { name, value } = e.target

		setFields((prev) => {
			return {
				...prev,
				[name]: value
			}
		})
	}

	function handleGroupChange(e, group_name) {
		const { id, value } = e.target
		setFields((prev) => {
			return {
				...prev,
				[group_name]: {
					...prev[group_name],
					[id]: value
				}
			}
		})
	}

	function handleAmenitiesChange(e) {
		const { value, checked } = e.target
		function removeAmenity(arr, value) {
			if (arr.includes(value)) {
				let index = arr.indexOf(value)
				arr.splice(index, 1)
			}
			return arr
		}
		setFields((prev) => {
			return {
				...prev,
				amenities: checked ? [...prev.amenities, value] : removeAmenity(fields.amenities, value)
			}
		})
	}

	function handleImagechange(e) {
		const images = [...fields.images]
		setFields(prev => ({
			...prev,
			images: [
				...images,
				...e.target.files
			]
		}))
	}

	async function handleSubmit(e) {
		setIsLoading(true)
		e.preventDefault()
		// convert image blob to base64 string
		let imagesBase64 = []
		if (fields.images.length) {
			for (const image of fields.images) {
				const imgBuffer = await image.arrayBuffer()
				const imgArr = Array.from(new Uint8Array(imgBuffer))
				const imgData = Buffer.from(imgArr)

				// convert image data to base64
				imagesBase64.push(imgData.toString('base64'))
			}
		}

		try {
			if (state) {
				const res = await fetch('/api/properties', {
					method: 'PUT',
					headers: {
						"Content-Type": "multipart/form-data",
					},
					body: JSON.stringify({ ...fields, images: imagesBase64, cloudImgs })
				})
				if (res) router.push(`/properties/${state?._id}`)
			} else {
				const res = await fetch('/api/properties', {
					method: 'POST',
					headers: {
						"Content-Type": "multipart/form-data",
					},
					body: JSON.stringify({ ...fields, images: imagesBase64, lngLat })
				})
				const property = await res.json()
				router.push(`/properties/${property._id}`)
			}
		} catch (error) {
			console.log(error)
		} finally {
			setIsLoading(false)
		}
	}

	return (
		<form onSubmit={handleSubmit}>
			<h2 className='mb-6 text-3xl font-semibold text-center'>
				Add Property
			</h2>
			<div className='mb-4'>
				<label
					htmlFor='property_type'
					className='block mb-2 font-bold text-gray-700'
				>
					Property Type
				</label>
				<select
					id='property_type'
					name='property_type'
					value={fields.property_type}
					onChange={handleChange}
					className='w-full px-3 py-2 border rounded'
					required
				>
					<option value='Apartment'>Apartment</option>
					<option value='Condo'>Condo</option>
					<option value='House'>House</option>
					<option value='Cabin Or Cottage'>Cabin or Cottage</option>
					<option value='Room'>Room</option>
					<option value='Studio'>Studio</option>
					<option value='Other'>Other</option>
				</select>
			</div>
			<div className='mb-4'>
				<label className='block mb-2 font-bold text-gray-700'>
					Listing Name
				</label>
				<input
					type='text'
					id='name'
					name='name'
					value={fields.name}
					onChange={handleChange}
					className='w-full px-3 py-2 mb-2 border rounded'
					placeholder='eg. Beautiful Apartment In Miami'
					required
				/>
			</div>
			<div className='mb-4'>
				<label
					htmlFor='description'
					className='block mb-2 font-bold text-gray-700'
				>
					Description
				</label>
				<textarea
					id='description'
					name='description'
					value={fields.description}
					onChange={handleChange}
					className='w-full px-3 py-2 border rounded'
					rows='4'
					placeholder='Add an optional description of your property'
				></textarea>
			</div>

			<div className='p-4 mb-4 bg-blue-50'>
				<label className='block mb-2 font-bold text-gray-700'>
					Location
				</label>
				<input
					type='text'
					id='street'
					name='street'
					value={fields.location.street}
					onChange={(e) => handleGroupChange(e, 'location')}
					className='w-full px-3 py-2 mb-2 border rounded'
					placeholder='Street'
				/>
				<input
					type='text'
					id='city'
					name='city'
					value={fields.location.city}
					onChange={(e) => handleGroupChange(e, 'location')}
					className='w-full px-3 py-2 mb-2 border rounded'
					placeholder='City'
					required
				/>
				<input
					type='text'
					id='state'
					name='state'
					value={fields.location.state}
					onChange={(e) => handleGroupChange(e, 'location')}
					className='w-full px-3 py-2 mb-2 border rounded'
					placeholder='State'
					required
				/>
				<input
					type='text'
					id='zipcode'
					name='zipcode'
					value={fields.location.zipcode}
					onChange={(e) => handleGroupChange(e, 'location')}
					className='w-full px-3 py-2 mb-2 border rounded'
					pattern="[0-9]{6}"
					inputMode="numeric"
					placeholder='Zipcode'
				/>
			</div>
			<div className="py-5">
				<PropertyMap draggable locatePin setLngLat={setLngLat} />
			</div>
			<div className='flex flex-wrap mb-4'>
				<div className='w-full pr-2 sm:w-1/3'>
					<label
						htmlFor='beds'
						className='block mb-2 font-bold text-gray-700'
					>
						Beds
					</label>
					<input
						type='number'
						id='beds'
						name='beds'
						value={fields.beds}
						onChange={handleChange}
						className='w-full px-3 py-2 border rounded'
						required
					/>
				</div>
				<div className='w-full px-2 sm:w-1/3'>
					<label
						htmlFor='baths'
						className='block mb-2 font-bold text-gray-700'
					>
						Baths
					</label>
					<input
						type='number'
						id='baths'
						name='baths'
						value={fields.baths}
						onChange={handleChange}
						className='w-full px-3 py-2 border rounded'
						required
					/>
				</div>
				<div className='w-full pl-2 sm:w-1/3'>
					<label
						htmlFor='square_feet'
						className='block mb-2 font-bold text-gray-700'
					>
						Square Feet
					</label>
					<input
						type='number'
						id='square_feet'
						name='square_feet'
						value={fields.square_feet}
						onChange={handleChange}
						className='w-full px-3 py-2 border rounded'
						required
					/>
				</div>
			</div>

			<div className='mb-4'>
				<label className='block mb-2 font-bold text-gray-700'>
					Amenities
				</label>
				<div className='grid grid-cols-2 gap-2 md:grid-cols-3'>
					<div>
						<input
							type='checkbox'
							id='amenity_wifi'
							name='amenities'
							value='Wifi'
							checked={fields.amenities.includes('Wifi')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_wifi'>Wi-Fi</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_kitchen'
							name='amenities'
							value='Full Kitchen'
							checked={fields.amenities.includes('Full Kitchen')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_kitchen'>Full kitchen</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_washer_dryer'
							name='amenities'
							value='Washer & Dryer'
							checked={fields.amenities.includes('Washer & Dryer')}
							className='mr-2'
							onChange={handleAmenitiesChange}
						/>
						<label htmlFor='amenity_washer_dryer'>Washer & Dryer</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_free_parking'
							name='amenities'
							value='Free Parking'
							checked={fields.amenities.includes('Free Parking')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_free_parking'>Free Parking</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_pool'
							name='amenities'
							value='Swimming Pool'
							checked={fields.amenities.includes('Swimming Pool')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_pool'>Swimming Pool</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_hot_tub'
							name='amenities'
							value='Hot Tub'
							checked={fields.amenities.includes('Hot Tub')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_hot_tub'>Hot Tub</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_24_7_security'
							name='amenities'
							value='24/7 Security'
							checked={fields.amenities.includes('24/7 Security')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_24_7_security'>24/7 Security</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_wheelchair_accessible'
							name='amenities'
							value='Wheelchair Accessible'
							checked={fields.amenities.includes('Wheelchair Accessible')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_wheelchair_accessible'>
							Wheelchair Accessible
						</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_elevator_access'
							name='amenities'
							value='Elevator Access'
							checked={fields.amenities.includes('Elevator Access')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_elevator_access'>
							Elevator Access
						</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_dishwasher'
							name='amenities'
							value='Dishwasher'
							checked={fields.amenities.includes('Dishwasher')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_dishwasher'>Dishwasher</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_gym_fitness_center'
							name='amenities'
							value='Gym/Fitness Center'
							checked={fields.amenities.includes('Gym/Fitness Center')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_gym_fitness_center'>
							Gym/Fitness Center
						</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_air_conditioning'
							name='amenities'
							value='Air Conditioning'
							checked={fields.amenities.includes('Air Conditioning')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_air_conditioning'>
							Air Conditioning
						</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_balcony_patio'
							name='amenities'
							value='Balcony/Patio'
							className='mr-2'
							checked={fields.amenities.includes('Balcony/Patio')}
							onChange={handleAmenitiesChange}
						/>
						<label htmlFor='amenity_balcony_patio'>Balcony/Patio</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_smart_tv'
							name='amenities'
							value='Smart TV'
							checked={fields.amenities.includes('Smart TV')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_smart_tv'>Smart TV</label>
					</div>
					<div>
						<input
							type='checkbox'
							id='amenity_coffee_maker'
							name='amenities'
							value='Coffee Maker'
							checked={fields.amenities.includes('Coffee Maker')}
							onChange={handleAmenitiesChange}
							className='mr-2'
						/>
						<label htmlFor='amenity_coffee_maker'>Coffee Maker</label>
					</div>
				</div>
			</div>

			<div className='p-4 mb-4 bg-blue-50'>
				<label className='block mb-2 font-bold text-gray-700'>
					Rates (Leave blank if not applicable)
				</label>
				<div className='flex flex-col space-y-4 sm:flex-row sm:space-y-0 sm:space-x-4'>
					<div className='flex items-center'>
						<label htmlFor='weekly_rate' className='mr-2'>
							Weekly
						</label>
						<input
							type='number'
							id='weekly'
							value={fields.rates.weekly}
							name='weekly'
							onChange={(e) => handleGroupChange(e, 'rates')}
							className='w-full px-3 py-2 border rounded'
						/>
					</div>
					<div className='flex items-center'>
						<label htmlFor='monthly_rate' className='mr-2'>
							Monthly
						</label>
						<input
							type='number'
							id='monthly'
							name='monthly'
							value={fields.rates.monthly}
							onChange={(e) => handleGroupChange(e, 'rates')}
							className='w-full px-3 py-2 border rounded'
						/>
					</div>
					<div className='flex items-center'>
						<label htmlFor='nightly_rate' className='mr-2'>
							Nightly
						</label>
						<input
							type='number'
							id='nightly'
							name='nightly'
							value={fields.rates.nightly}
							onChange={(e) => handleGroupChange(e, 'rates')}
							className='w-full px-3 py-2 border rounded'
						/>
					</div>
				</div>
			</div>

			<div className='mb-4'>
				<label
					htmlFor='seller_name'
					className='block mb-2 font-bold text-gray-700'
				>
					Seller Name
				</label>
				<input
					type='text'
					id='seller_name'
					name='seller_name'
					value={fields.seller.seller_name}
					className='w-full px-3 py-2 border rounded'
					onChange={(e) => handleGroupChange(e, 'seller')}
					placeholder='Name'
				/>
			</div>
			<div className='mb-4'>
				<label
					htmlFor='seller_email'
					className='block mb-2 font-bold text-gray-700'
				>
					Seller Email
				</label>
				<input
					type='email'
					id='seller_email'
					name='seller_email'
					value={fields.seller.seller_email}
					className='w-full px-3 py-2 border rounded'
					onChange={(e) => handleGroupChange(e, 'seller')}
					placeholder='Email address'
					required
				/>
			</div>
			<div className='mb-4'>
				<label
					htmlFor='seller_phone'
					className='block mb-2 font-bold text-gray-700'
				>
					Seller Phone
				</label>
				<input
					type='tel'
					id='seller_phone'
					name='seller_phone'
					value={fields.seller.seller_phone}
					className='w-full px-3 py-2 border rounded'
					onChange={(e) => handleGroupChange(e, 'seller')}
					placeholder='Phone'
				/>
			</div>

			<div className="flex gap-2 flex-nowrap">
				{cloudImgs.length > 0 && cloudImgs.map((image, idx) => {
					return <div key={idx} className="relative w-32 h-24 mb-2 overflow-hidden rounded-md">
						<Image layout='fill' sizes='100px' className="object-cover" src={image} alt='' />
						<span onClick={() => {
							const newImagesArr = state.images
							newImagesArr.splice(idx, 1)
							setCloudImgs([...newImagesArr])
						}} className="absolute cursor-pointer top-[1px] right-[1px]"><AiFillCloseCircle size={20} /></span>
					</div>
				})}
			</div>
			<div className="flex gap-2 flex-nowrap">
				{fields.images.length > 0 && fields.images.map((image, idx) => {
					const url = URL.createObjectURL(image)
					return <div key={idx} className="relative w-32 h-24 mb-2 overflow-hidden rounded-md">
						<Image width={0} height={0} className="object-cover w-full h-full" src={url} alt='' />
						<span onClick={() => {
							const newImagesArr = fields.images
							newImagesArr.splice(idx, 1)
							setFields(prev => ({
								...prev,
								images: newImagesArr
							}))
						}} className="absolute top-0 right-0 cursor-pointer"><AiFillCloseCircle size={20} /></span>
					</div>
				})}
			</div>
			<div className='mb-4'>
				<label
					htmlFor='images'
					className='block mb-2 font-bold text-gray-700'
				>
					Images (Select up to 4 images)
				</label>
				<input
					type='file'
					id='images'
					name='images'
					onChange={handleImagechange}
					className='w-full px-3 py-2 border rounded'
					accept='image/*'
					multiple
					required={state ? false : true}
				/>
			</div>
			<div>
				<button
					className='flex items-center justify-center w-full gap-2 px-4 py-2 font-bold text-white bg-green-700 rounded-full hover:bg-green-600 focus:outline-none focus:shadow-outline'
					type='submit'
				>
					<Spinner
						color='#f2f2f2'
						loading={isLoading}
						margin={0}
						size={20}
						aria-label='Loading Spinner'
					/> {state && isLoading ? 'Updating' : isLoading ? 'Adding' : state ? 'Update' : 'Add'} Property
				</button>
			</div>
		</form>
	)
}

export default PropertyAddForm