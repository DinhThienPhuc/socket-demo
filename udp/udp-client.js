const dgram = require('dgram')
const client = dgram.createSocket('udp4')
const fs = require('fs')
const inputPath = process.argv[2]
let packCount = 0

fs.open(inputPath, 'r', (err, fd) => {
	if (err) console.log('Error while opening file!')
	fs.fstat(fd, (err, stats) => {
		if (err) console.log('Error while read stat of file!')
		let fileSize = stats.size
		let offset = 0
		let readByRange = () => {
			if (offset < fileSize) {
				let chunkSize = 64 * 1000
				let length = chunkSize
				if (offset + chunkSize > fileSize) {
					length = fileSize - offset
				}
				let buffer = Buffer.alloc(chunkSize)
				fs.readSync(fd, buffer, 0, length, offset)
				console.log(buffer)
				client.send(buffer, 41234, '0.0.0.0', err => {
					offset += chunkSize
					packCount++
					readByRange()
				})
			} else {
				fs.close(fd)
				console.log('No more data to read!')
				console.log('Package counts: ', packCount)
				client.send(Buffer.from('End!'), 41234, '0.0.0.0', err => {
					if (err) console.log('Error while send ended chunk file!')
					client.close()
				})
			}
		}

		readByRange()
	})
})
