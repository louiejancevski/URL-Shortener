gsap.from('.mainTitle', { duration: 1.5, y: 20, opacity: 0 })
gsap.from('#input', { duration: 1.5, x: 20, opacity: 0 })
gsap.from('#input2', { duration: 1.5, x: -20, opacity: 0 })
gsap.from('.btn-animation', { duration: 1.5, x: 40, opacity: 0 })
gsap.from('.note', { duration: 1.5, y: 20, opacity: 0 })
gsap.from('.madeBy', { duration: 2, opacity: 0 })

var createShortURL = document.getElementById('createShortURL')

createShortURL.addEventListener('submit', function (e) {
	var url = document.getElementById('url').value
	var slug = document.getElementById('slug').value
	let data = { url: url, slug: slug }

	fetch('create/shortURL', {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(data),
	}).then(async (response) => {
		if (response.ok) {
			const data = await response.json()
			document.getElementById('message').innerHTML = `Your short URL is now: <a target="_blank"href="/${data.slug}">${window.location.origin + '/' + data.slug}</a> `
		} else if (response.status === 429) {
			document.getElementById('message').innerHTML = `You are sending too many requests. Try again in 30 seconds.`
		} else {
			const result = await response.json()
			document.getElementById('message').innerHTML = result.message
		}
	})

	url = ''
	slug = ''
	e.preventDefault()
})
