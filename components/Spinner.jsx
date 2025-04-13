'use client';
import ClipLoader from 'react-spinners/ClipLoader';

const Spinner = ({ loading, margin = '100px auto', size = 50, color = '#15803d' }) => {
	return (
		<div className='flex items-center justify-center'>
			<ClipLoader
				color={color}
				loading={loading}
				cssOverride={{
					display: 'block',
					margin: margin,
				}}
				size={size}
				aria-label='Loading Spinner'
			/>
		</div>
	);
};
export default Spinner;