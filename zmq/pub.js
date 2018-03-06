const zmq = require('zmq')
const publisher = zmq.socket('pub')
const fs = require('fs')
const fileName = process.argv[2]

fs.watch(fileName, () => {
	publisher.send(
		JSON.stringify({
			type: 'changed',
			file: fileName,
			timestamp: Date.now()
		})
	)
})

publisher.bind('tcp://127.0.0.1:12138', err => {
	if (err) throw err
	console.log('Listen for zmq subcribers..')
})
