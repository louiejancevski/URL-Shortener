const express = require('express')
const mongoose = require('mongoose')
const app = express()
const rateLimit = require('express-rate-limit')
const { nanoid } = require('nanoid')
const shortURL = require('./models/shortURL')

mongoose.connect('mongodb://localhost/shortner', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.use(express.static('./public'))

app.get('/', async (req, res) => {
	res.render('index')
})

app.post(
	'/create/shortURL',
	rateLimit({
		windowMs: 30 * 1000,
		max: 3,
	}),
	async (req, res, next) => {
		let { slug, url } = req.body
		try {
			if (!slug) slug = nanoid(5)
			else {
				const slugExists = await shortURL.findOne({ slug: slug })
				if (slugExists) throw new Error('This slug is in use already 😔')
			}
			slug = slug.toLowerCase()
			const created = await shortURL.create({ url, slug })
			res.send(created)
		} catch (error) {
			next(error)
		}
	}
)

app.get('/:shortURL', async (req, res) => {
	const slug = await shortURL.findOne({ slug: req.params.shortURL })
	if (slug == null) return res.status(404).render('errors/404')
	slug.clicks++
	slug.save()
	res.redirect(slug.url)
})

app.use((req, res, next) => {
	const error = new Error('Not found')
	error.status = 404
	next(error)
})

app.use((error, req, res, next) => {
	res.status(error.status || 500)
	if (error.status == 404) {
		res.render('errors/404')
	} else {
		res.render('errors/error')
	}
})

app.listen(process.env.PORT || 5000)
