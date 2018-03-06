const prompt = require('prompt')
const client = require('net').connect({ port: 12138 })
const colors = require('colors')
prompt.message = ''
prompt.start()

const onErr = err => {
	console.log(err.message)
	client.destroy()
	process.exit()
}

const getPrompt = title => {
	prompt.get([title], (err, result) => {
		if (err) onErr(err)
		client.write(result[title])
		getPrompt(title)
	})
}

client.on('data', data => {
	let message = JSON.parse(data)
	switch (message.type) {
		case 'greeting':
			console.log(`\n${colors.magenta('Server:')} ${message.content}`)
			getPrompt(message.name)
			break
		case 'notification':
			console.log(`\n${colors.green('Server:')} ${message.content}`)
			break
		case 'message':
			console.log(
				`\n${colors.cyan(message.name + ':')} ${message.content}`
			)
			break
		default:
			break
	}
})

process.on('SIGINT', () => {
	client.destroy()
	process.exit()
})
