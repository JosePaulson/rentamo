const apiDomain = process.env.NEXT_PUBLIC_API_DOMAIN || null

// Fetch all properties
const fetchProperties = async () => {
	try {
		if (!apiDomain) return []

		const response = await fetch(`${apiDomain}/properties`, { cache: 'no-store' })
		if (!response.ok) throw new Error("Sorry fetching data failed.")

		return response.json()
	} catch (error) {
		console.log(error)
		return []
	}
}

//Fetch property by id (single property)
const fetchProperty = async (id) => {
	try {
		if (!apiDomain) return null

		const response = await fetch(`${apiDomain}/properties/${id}`)
		if (!response.ok) throw new Error("Sorry fetching data failed.")

		return response.json()
	} catch (error) {
		console.log(error)
		return null
	}
}

//Fetch all user properties
const fetchUserProperties = async (userId) => {
	try {
		if (!apiDomain) return null

		const response = await fetch(`${apiDomain}/properties/user/${userId}`)
		if (!response.ok) throw new Error("Sorry fetching data failed.")

		return response.json()
	} catch (error) {
		console.log(error)
		return null
	}
}

//Delete property by id (single property)
const deleteUserProperty = async (propertyId) => {
	try {
		if (!apiDomain) return null

		const response = await fetch(`${apiDomain}/properties/${propertyId}`, { method: 'DELETE' })
		if (!response.ok) throw new Error("Property not deleted")

		return response
	} catch (error) {
		console.log(error)
		return null
	}
}

export { fetchProperties, fetchProperty, fetchUserProperties, deleteUserProperty }