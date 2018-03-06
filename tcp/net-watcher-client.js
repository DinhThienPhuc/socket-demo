const net = require('net')
const client = net.connect({ port: 41234 })
let buffer = ''

client.on('data', data => {
	buffer += data.toString('utf8')
	let boundary = buffer.indexOf('\n')
	if (-1 !== +boundary) {
		let message = JSON.parse(buffer.substr(0, boundary))
		buffer = buffer.substr(boundary + 1)
		switch (message.type) {
			case 'watching':
				console.log('Now watching file ' + message.file + '...')
				break
			case 'changed':
				console.log(
					'File ' +
						message.file +
						' has changed at ' +
						new Date(message.timestamp)
				)
				break
			default:
				console.log('Unrecognized message type: ', message.type)
				break
		}
	}
})
