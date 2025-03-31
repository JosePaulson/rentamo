'use client';
import ClipLoader from 'react-spinners/ClipLoader';

const override = {
	display: 'block',
	margin: '100px auto',
};

const Spinner = ({ loading }) => {
	return (
		<div className='flex items-center justify-center h-[200px]'>
			<ClipLoader
				color='#15803d'
				loading={loading}
				cssOverride={override}
				size={50}
				aria-label='Loading Spinner'
			/>
		</div>
	);
};
export default Spinner;