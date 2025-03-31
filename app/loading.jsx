'use client';
import ClipLoader from 'react-spinners/ClipLoader';

const override = {
	display: 'block',
	margin: '100px auto',
};

const loading = ({ loading }) => {
	return (
		<div className='flex items-center justify-center h-screen'>
			<ClipLoader
				color='#15803d'
				loading={loading}
				cssOverride={override}
				size={150}
				aria-label='Loading Spinner'
			/>
		</div>
	);
};
export default loading;