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

	const formData = await request.formData()
	const amenities = formData.getAll('amenities')
	console.log(formData.get('seller_name'))
	const images = formData.getAll('images')

	const propertyData = {
		property_type: formData.get('property_type'),
		name: formData.get('name'),
		description: formData.get('description'),
		location: {
			street: formData.get('street'),
			city: formData.get('city'),
			state: formData.get('state'),
			zipcode: formData.get('zipcode'),
		},
		beds: formData.get('beds'),
		baths: formData.get('baths'),
		square_feet: formData.get('square_feet'),
		amenities,
		rates: {
			weekly: formData.get('weekly'),
			monthly: formData.get('monthly'),
			nightly: formData.get('nightly'),
		},
		seller: {
			seller_name: formData.get('seller_name'),
			seller_email: formData.get('seller_email'),
			seller_phone: formData.get('seller_phone'),
		},
		owner: session.user.id,
	}
	try {
		let imageUrlPromises = []
		for (const image of images) {
			const imgBuffer = await image.arrayBuffer()
			const imgArr = Array.from(new Uint8Array(imgBuffer))
			const imgData = Buffer.from(imgArr)

			// convert image data to base64
			const imgBase64 = imgData.toString('base64')

			// upload to cloudinary
			const result = await cloudinary.uploader.upload(`data:image/png;base64,${imgBase64}`, { folder: 'rentamo' })

			// push each cloudinary url to imageUrlPromises array
			imageUrlPromises.push(result.secure_url)
		}

		// wait until all images uploaded successfull
		const imageUrls = await Promise.all(imageUrlPromises)
		console.log(imageUrls)
		// add uploaded urls array to propertyData object
		propertyData.images = imageUrls

		const res = await Property.create(propertyData)
		if (res) {
			return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${res._id}`)
		} else {
			return new Response('Something went wrong, property not added', { status: 400 })
		}
	} catch (error) {
		return new Response('ERROR', { status: 500 })
	}
}

export const PUT = async (request) => {

	await connectDB()
	const session = await getServerSession(authOptions)

	if (!session) {
		return new Response('Unauthorized', { status: 401 })
	}

	const formData = await request.formData()
	const amenities = formData.getAll('amenities')
	const images = formData.getAll('images')
	const cloudImgs = JSON.parse(formData.get('cloudImgs'))

	console.log(cloudImgs)

	const propertyData = {
		property_type: formData.get('property_type'),
		name: formData.get('name'),
		description: formData.get('description'),
		location: {
			street: formData.get('street'),
			city: formData.get('city'),
			state: formData.get('state'),
			zipcode: formData.get('zipcode'),
		},
		beds: formData.get('beds'),
		baths: formData.get('baths'),
		square_feet: formData.get('square_feet'),
		amenities,
		rates: {
			weekly: formData.get('weekly'),
			monthly: formData.get('monthly'),
			nightly: formData.get('nightly'),
		},
		seller: {
			seller_name: formData.get('seller_name'),
			seller_email: formData.get('seller_email'),
			seller_phone: formData.get('seller_phone'),
		},
		owner: session.user.id,
	}
	try {
		let imageUrlPromises = []
		for (const image of images) {
			const imgBuffer = await image.arrayBuffer()
			const imgArr = Array.from(new Uint8Array(imgBuffer))
			const imgData = Buffer.from(imgArr)

			// convert image data to base64
			const imgBase64 = imgData.toString('base64')

			// upload to cloudinary
			const result = await cloudinary.uploader.upload(`data:image/png;base64,${imgBase64}`, { folder: 'rentamo' })

			// push each cloudinary url to imageUrlPromises array
			imageUrlPromises.push(result.secure_url)
		}

		// wait until all images uploaded successfull
		const imageUrls = await Promise.all(imageUrlPromises)
		console.log(imageUrls)
		// add uploaded urls array to propertyData object
		propertyData.images = imageUrls

		// const res = await Property.create(propertyData)
		if (res) {
			// return Response.redirect(`${process.env.NEXTAUTH_URL}/properties/${res._id}`)
			return new Response('hello')
		} else {
			return new Response('Something went wrong, property not added', { status: 400 })
		}
	} catch (error) {
		return new Response('ERROR', { status: 500 })
	}
}