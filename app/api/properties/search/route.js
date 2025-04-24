import connectDB from "@/config/database";
import Property from "@/models/Property";

// GET /api/properties/search
export const GET = async (request) => {
	try {
		let query;
		await connectDB()

		const { searchParams } = new URL(request.url)

		const queryString = searchParams.get('queryString')
		if (queryString) {
			let q = []
			for (const [key, value] of Object.entries(JSON.parse(queryString))) {
				if (value !== '') q.push({ [key]: key == 'beds' ? Number(value) : new RegExp(value, 'i') })
			}
			query = {
				$and: [
					...q
				]
			}
		} else {
			const location = searchParams.get('location')
			const propertyType = searchParams.get('propertyType')

			const locationPattern = new RegExp(location, 'i')

			query = {
				$or: [
					{ name: locationPattern },
					{ description: locationPattern },
					{ 'location.street': locationPattern },
					{ 'location.city': locationPattern },
					{ 'location.state': locationPattern },
					{ 'location.zip': locationPattern }
				]
			}
			if (propertyType !== 'All') {
				const propertyTypePattern = new RegExp(propertyType, 'i')
				query.property_type = propertyTypePattern
			}
		}

		const properties = await Property.find(query)

		return new Response(JSON.stringify(properties), { status: 200 })
	} catch (error) {
		console.log(error)
		return new Response('Something went wrong', { status: 500 })
	}
}