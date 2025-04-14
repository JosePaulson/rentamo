import connectDB from "@/config/database"
import User from "@/models/User"
import { authOptions } from "@/utils/authOptions"
import { getServerSession } from "next-auth"

//GET /api/properties/user/:userId
export const GET = async (request) => {
	try {
		await connectDB()
		const session = await getServerSession(authOptions)

		if (!session) {
			return new Response('Unauthorized', { status: 401 })
		}

		const user = await User.findById(session?.user?.id)

		if (!user) return new Response('User Not Found', { status: 404 })

		return new Response(JSON.stringify(user), { status: 200 })
	} catch (error) {
		console.log(error);
		return new Response('Something went wrong', { status: 500 });
	}
}