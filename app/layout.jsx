import React from 'react'
import Navbar from '@/components/Navbar'
import '@/assets/styles/globals.css'
import Footer from '@/components/Footer'
import AuthProvider from '@/components/AuthProvider'
import { ToastContainer } from 'react-toastify'

export const metadata = {
	title: "Rentomo | Find the perfect home rental",
	description: "Find your dream rental property",
	keywords: "rental, rental property, find rental, houses, apartment for rent, house for rent"
}

const MainLayout = ({ children }) => {
	return (
		<AuthProvider>
			<html lang='en'>
				<body>
					<Navbar />
					<div>{children}</div>
					<Footer />
					<ToastContainer />
				</body>
			</html>
		</AuthProvider>
	)
}

export default MainLayout