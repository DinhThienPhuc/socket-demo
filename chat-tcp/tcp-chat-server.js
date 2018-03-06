const net = require('net')
let clients = []

const server = net.createServer(socket => {
	socket.name = socket.remoteAddress + ':' + socket.remotePort
	clients.push(socket)
	let announce = (message, sender) => {
		clients.forEach(client => {
			if (client == sender) return
			client.write(message)
		})
		console.log(message + '\n')
	}

	socket.write(
		JSON.stringify({
			type: 'greeting',
			content: 'Welcome ' + socket.name,
			name: socket.name
		})
	)

	announce(
		JSON.stringify({
			type: 'notification',
			content: socket.name + ' has joined room chat'
		}),
		socket
	)

	socket.on('data', data => {
		announce(
			JSON.stringify({
				type: 'message',
				content: data.toString('utf8'),
				name: socket.name
			}),
			socket
		)
	})

	socket.on('close', () => {
		announce(
			JSON.stringify({
				type: 'notification',
				content: socket.name + ' has left room chat'
			}),
			socket
		)
		clients.splice(clients.indexOf(socket), 1)
	})
})

server.listen(12138, () => {
	console.log('Server is listening on port 12138')
})
