import connectDB from "@/config/database"
import Property from "@/models/Property"
import { getServerSession } from "next-auth"
import { authOptions } from "@/utils/authOptions"

//GET /api/properties/:id
export const GET = async (request, { params }) => {
	try {
		await connectDB()

		const property = await Property.findById(params.id)

		if (!property) return new Response('Property Not Found', { status: 404 })

		return new Response(JSON.stringify(property), { status: 200 })
	} catch (error) {
		console.log(error);
		return new Response('Something went wrong', { status: 500 });
	}
}

//DELETE /api/properties/:id
export const DELETE = async (request, { params }) => {
	try {
		await connectDB()

		const session = await getServerSession(authOptions)

		if (!session) {
			return new Response('Unauthorized', { status: 401 })
		}

		const property = await Property.findById(params.id)

		if (!property) return new Response('Property Not Found', { status: 404 })

		if (!session?.user?.id === property.owner) return new Response('Unauthorized', { status: 401 })

		await Property.findByIdAndDelete(params.id)

		return new Response('Property deleted', { status: 200 })
	} catch (error) {
		console.log(error);
		return new Response('Something went wrong', { status: 500 });
	}
}