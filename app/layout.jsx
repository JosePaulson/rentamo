import React from 'react'
import '@/assets/styles/globals.css'

export const metadata = {
	title: "PropertyPulse | Find the perfect home rental",
	description: "Find your dream rental property",
	keywords: "rental, rental property, find rental, houses, apartment for rent, house for rent"
}
const MainLayout = ({ children }) => {
	return (
		<html lang='en'>
			<body>
				<div>{children}</div>
			</body>
		</html>
	)
}

export default MainLayout