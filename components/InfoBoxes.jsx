import InfoBox from './InfoBox';

const InfoBoxes = () => {
	return (
		<section>
			<div className='m-auto container-xl lg:container'>
				<div className='grid grid-cols-1 gap-4 p-4 rounded-lg md:grid-cols-2'>
					<InfoBox
						heading='For Renters'
						backgroundColor='bg-gray-100'
						buttonInfo={{
							text: 'Browse Properties',
							link: '/properties',
							backgroundColor: 'bg-black',
						}}
					>
						Find your dream rental property. Bookmark properties and contact
						owners.
					</InfoBox>
					<InfoBox
						heading='For Property Owners'
						backgroundColor='bg-green-100'
						buttonInfo={{
							text: 'Add Property',
							link: '/properties/add',
							backgroundColor: 'bg-green-700',
						}}
					>
						List your properties and reach potential tenants. Rent as an Airbnb
						or long term.
					</InfoBox>
				</div>
			</div>
		</section>
	);
};
export default InfoBoxes;