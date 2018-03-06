const zmq = require('zmq')
const subscriber = zmq.socket('sub')

subscriber.subscribe('') // subscribe all messages coming

subscriber.on('message', data => {
	let msg = JSON.parse(data)
	let date = new Date(msg.timestamp)
	console.log(`File ${msg.file} has changed at ${date}`)
})

subscriber.connect('tcp://127.0.0.1:12138')
