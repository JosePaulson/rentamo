import { Schema, models, model } from "mongoose";

const PropertySchema = new Schema({
	owner: {
		type: Schema.Types.ObjectId,
		ref: 'User',
		required: true,
	},
	name: {
		type: String,
		required: true,
	},
	property_type: {
		type: String,
		required: true,
	},
	description: {
		type: String,
	},
	location: {
		street: {
			type: String,
		},
		city: {
			type: String,
		},
		state: {
			type: String,
		},
		zipcode: {
			type: String,
		},
	},
	beds: {
		type: Number,
		required: true
	},
	baths: {
		type: Number,
		required: true
	},
	square_feet: {
		type: Number,
		required: true
	},
	amenities: [
		{
			type: String
		}
	],
	rates: {
		nightly: {
			type: Number
		},
		weekly: {
			type: Number
		},
		monthly: {
			type: Number
		},
	},
	seller: {
		seller_name: {
			type: String
		},
		seller_email: {
			type: String
		},
		seller_phone: {
			type: String
		},
	},
	images: [
		{
			type: String
		}
	],
	isFeatured: {
		type: Boolean,
		default: false
	}
}, { timestamps: true })

const Property = models.Property || model("Property", PropertySchema)

export default Property