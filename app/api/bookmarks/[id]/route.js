import connectDB from "@/config/database";
import User from "@/models/User";
import Property from "@/models/Property";
import { authOptions } from "@/utils/authOptions";
import { getServerSession } from "next-auth";

export const PUT = async (request, { params }) => {
	const session = await getServerSession(authOptions)
	connectDB()

	if (!session) {
		return new Response('Unauthorized', { status: 401 })
	}

	try {
		const property = await Property.findById(params.id)
		if (property) {
			const { bookmarks } = await User.findById(session.user.id)
			let updatedBookmarks
			let action
			if (bookmarks.includes(params.id)) {
				updatedBookmarks = bookmarks.filter(bookmark => bookmark != params.id)
				action = 'removed from bookmarks'
			} else {
				updatedBookmarks = [...bookmarks, params.id]
				action = 'added to bookmarks'
			}
			const res = await User.findByIdAndUpdate(session.user.id, { bookmarks: updatedBookmarks })
			if (res) {
				return new Response(JSON.stringify({ 'message': `${property.name} ${action}`, 'bookmarks': updatedBookmarks }))
			}
		}
	} catch (error) {
		console.error(error)
	}
}

export const GET = async (request, { params }) => {
	connectDB()
	const session = await getServerSession(authOptions)

	if (!session) {
		return new Response('Unauthorized', { status: 401 })
	}

	try {
		const { bookmarks } = await User.findById(session.user.id)
		const savedProperties = await Property.find({ _id: { $in: bookmarks } })

		return new Response(JSON.stringify(savedProperties))
	} catch (error) {
		console.error(error)
	}
}