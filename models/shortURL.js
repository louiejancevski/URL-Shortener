const mongoose = require('mongoose')

const shortURLSchema = mongoose.Schema({
	url: {
		type: String,
		required: true,
	},
	slug: {
		type: String,
		required: true,
	},
	clicks: {
		type: Number,
		default: 0,
	},
})

module.exports = mongoose.model('shortURL', shortURLSchema)
