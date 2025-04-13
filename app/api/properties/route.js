import connectDB from "@/config/database";
import Property from "@/models/Property";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/utils/authOptions";
import cloudinary from "@/config/cloudinary";

//GET /api/properties
export const GET = async (request) => {
	try {
		await connectDB();
		const properties = await Property.find({})
		return new Response(JSON.stringify(properties), { status: 200 })
	} catch (error) {
		console.log(error);
		return new Response('Something went wrong', { status: 500 });
	}
}

export const POST = async (request) => {

	await connectDB()
	const session = await getServerSession(authOptions)

	if (!session) {
		return new Response('Unauthorized', { status: 401 })
	}
	const formData = await request.json()
	// console.log(formData)
	const propertyData = {
		...formData,
		owner: session.user.id,
	}

	try {
		let imageUrlPromises = []
		for (const imgBase64 of formData.images) {

			// upload to cloudinary
			const result = await cloudinary.uploader.upload(`data:image/png;base64,${imgBase64}`, { folder: 'rentamo' })

			// push each cloudinary url to imageUrlPromises array
			imageUrlPromises.push(result.secure_url)
		}

		// wait until all images uploaded successfull
		const imageUrls = await Promise.all(imageUrlPromises)
		// add uploaded urls array to propertyData object
		propertyData.images = imageUrls

		const res = await Property.create(propertyData)
		if (res) {
			return new Response(JSON.stringify(res), { status: 302 })
		} else {
			return new Response('Something went wrong, property not added', { status: 400 })
		}

		// return new Response('property added', { status: 200 })
	} catch (error) {
		return new Response('ERROR', { status: 500 })
	}
}

export const PUT = async (request) => {

	await connectDB()
	const session = await getServerSession(authOptions)

	const formData = await request.json()

	if (!session && session.user.id !== formData.owner) {
		return new Response('Unauthorized', { status: 401 })
	}

	const propertyData = {
		...formData
	}
	delete propertyData._id
	delete propertyData.cloudImgs

	try {
		if (formData?.images.length) {
			let imageUrlPromises = []
			for (const imgBase64 of formData.images) {

				// upload to cloudinary
				const result = await cloudinary.uploader.upload(`data:image/png;base64,${imgBase64}`, { folder: 'rentamo' })

				// push each cloudinary url to imageUrlPromises array
				imageUrlPromises.push(result.secure_url)
			}

			// wait until all images uploaded successfull
			const imageUrls = await Promise.all(imageUrlPromises)
			// add uploaded urls array to propertyData object + previous images
			propertyData.images = [...formData.cloudImgs, ...imageUrls]
		} else {
			// previous images already on cloudinary
			propertyData.images = [...formData.cloudImgs]
		}

		const res = await Property.findByIdAndUpdate(formData._id, propertyData)
		if (res) {
			return new Response(JSON.stringify(res), { status: 302 })
		} else {
			return new Response('Something went wrong, property not added', { status: 400 })
		}
	} catch (error) {
		return new Response('ERROR', { status: 500 })
	}
}