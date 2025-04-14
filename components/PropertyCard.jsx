import Image from 'next/image';
import Link from 'next/link';
import { FaBed, FaBath, FaRulerCombined, FaMoneyBill, FaMapMarkerAlt, FaBookmark } from 'react-icons/fa';
import Spinner from './Spinner';

const PropertyCard = ({ property, handleUnsave = null, isLoadingUnsave }) => {
	return (
		<div className='relative overflow-hidden shadow-md rounded-xl'>
			<div className='relative w-full h-60'>
				<Image
					src={property.images[0]}
					width={0}
					height={0}
					alt={''}
					className='object-cover size-full'
					sizes='100vw'
				/>
			</div>
			<div className='p-4'>
				<div className='mb-6 text-left md:text-center lg:text-left'>
					<div className='text-gray-600'>{property.property_type}</div>
					<h3 className='text-xl font-bold'>{property.name}</h3>
				</div>
				<h3 className='absolute top-[10px] right-[10px] bg-white px-4 py-2 rounded-lg text-green-700 font-bold text-right md:text-center lg:text-right'>
					${property.rates.monthly ? property.rates.monthly + '/month' : property.rates.weekly ? property.rates.weekly + '/week' : property.rates.nightly + '/night'}
				</h3>
				{handleUnsave && <button onClick={() => handleUnsave(property._id)} className='absolute top-[10px] left-[10px] bg-white px-4 py-2 rounded-lg text-red-700 font-semibold text-right md:text-center lg:text-right flex gap-1 items-center'>{isLoadingUnsave ? <Spinner margin='0px' size={15} color='#222a' /> : <FaBookmark />} {isLoadingUnsave ? 'Removing' : 'Unsave'}</button>}

				<div className='flex justify-center gap-4 mb-4 text-gray-500'>
					<p>
						<FaBed className='mr-2 md:hidden lg:inline' /> {property.beds}
						<span className='md:hidden lg:inline'> Beds</span>
					</p>
					<p>
						<FaBath className='mr-2 md:hidden lg:inline' /> {property.baths}
						<span className='md:hidden lg:inline'> Baths</span>
					</p>
					<p>
						<FaRulerCombined className='mr-2 md:hidden lg:inline' />{' '}
						{property.square_feet}
						<span className='md:hidden lg:inline'> sqft</span>
					</p>
				</div>

				<div className='flex justify-center gap-4 mb-4 text-sm text-green-900'>
					<p>
						<FaMoneyBill className='mr-2 md:hidden lg:inline' /> Weekly
					</p>
					<p>
						<FaMoneyBill className='mr-2 md:hidden lg:inline' /> Monthly
					</p>
				</div>

				<div className='mb-5 border border-gray-100'></div>

				<div className='flex flex-col justify-between mb-4 lg:flex-row'>
					<div className='flex gap-2 mb-4 align-middle lg:mb-0'>
						<span className='flex items-center text-orange-700'>
							<FaMapMarkerAlt className='mr-2 md:hidden lg:inline' /> {property.location.city}, {property.location.state}
						</span>
					</div>
					<Link
						href={`/properties/${property._id}`}
						className='h-[36px] bg-green-700 hover:bg-green-800 text-white px-4 py-2 rounded-lg text-center text-sm'
					>
						Details
					</Link>
				</div>
			</div>
		</div>
	);
};
export default PropertyCard;