const fs = require('fs')

fs.open('nene2.png', 'r', (err, fd) => {
	if (err) throw err
	fs.fstat(fd, (err, stats) => {
		if (err) throw err
		const size = stats.size
		let offset = 0
		// console.log(stats.size)
		while (offset < size) {
			let chunkSize = 64 * 1000
			let length = chunkSize
			if (offset + chunkSize > size) {
				length = size - offset
			}
			let buffer = Buffer.alloc(chunkSize)
			fs.readSync(fd, buffer, 0, length, 0)
			console.log(buffer)
			offset += chunkSize
		}
	})
})
