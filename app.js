const express = require('express')
const mongoose = require('mongoose')
const app = express()
const rateLimit = require('express-rate-limit')
const { nanoid } = require('nanoid')

const shortURL = require('./models/shortURL')

mongoose.connect('mongodb://localhost/ulrshortner', {
	useNewUrlParser: true,
	useUnifiedTopology: true,
})

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.set('view engine', 'ejs')
app.use(express.static('./public'))

app.get('/', async (req, res) => {
	res.render('index', { msg: null })
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
			if (!slug) {
				slug = nanoid(6)
				console.log(slug)
			} else {
				const slugExists = await shortURL.findOne({ slug: slug })

				if (slugExists) {
					throw new Error('This slug is in use already 😔')
				}
			}

			slug = slug.toLowerCase()

			const created = await shortURL.create({ url, slug })
			res.send(created)
		} catch (error) {
			next()
		}
	}
)

app.get('/:shortURL', async (req, res) => {
	const slug = await shortURL.findOne({ slug: req.params.shortURL })
	if (slug == null) {
		return res.status(404).render('404')
	}
	slug.clicks++
	slug.save()
	res.redirect(slug.url)
})

app.use((req, res, next) => {
	res.status(404).render('404')
})

app.listen(process.env.PORT || 5000)
