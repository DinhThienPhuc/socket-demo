const dgram = require('dgram')
const server = dgram.createSocket('udp4')
const fs = require('fs')
const outputPath = 'output/' + process.argv[2]
let stream = fs.createWriteStream(outputPath)
let packCount = 0

server.on('error', err => {
	console.log(`Server error:\n${err.stack}`)
	server.close()
})

server.on('message', (msg, rinfo) => {
	console.log(`Server got data from ${rinfo.address}:${rinfo.port}`)
	console.log('Msg: ', msg)
	if (!stream) {
		stream = fs.createWriteStream(outputPath)
	}
	if (msg.toString('utf8') === 'End!') {
		stream.end()
		stream = null
		console.log('Package counts: ', packCount)
		packCount = 0
	} else {
		stream.write(msg)
		packCount++
	}
})

server.on('listening', () => {
	const address = server.address()
	console.log(`Server listening ${address.address}:${address.port}`)
})

server.bind(41234)
// server listening 0.0.0.0:41234
