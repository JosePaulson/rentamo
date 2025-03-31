const Footer = () => {
	const currentYear = new Date().getFullYear();

	return (
		<footer className='py-4 bg-gray-200'>
			<div className='container flex flex-col items-center justify-between px-4 mx-auto md:flex-row'>
				<div className='mb-4 md:mb-0'>
					<h4 className="text-xl font-bold">Rentomo</h4>
					{/* <Image src={logo} alt='Logo' className='w-auto h-8' /> */}
				</div>
				<div className='flex flex-wrap justify-center mb-4 md:justify-start md:mb-0'>
					<ul className='flex space-x-4'>
						<li>
							<a href='/properties'>Properties</a>
						</li>
						<li>
							<a href='/terms'>Terms of Service</a>
						</li>
					</ul>
				</div>
				<div>
					<p className='mt-2 text-sm text-gray-500 md:mt-0'>
						&copy; {currentYear} Rentomo. All rights reserved.
					</p>
				</div>
			</div>
		</footer>
	);
};

export default Footer;