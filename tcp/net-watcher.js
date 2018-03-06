const net = require('net')
const fs = require('fs')
const fileName = process.argv[2]

const server = net.createServer(socket => {
	console.log('Subscriber connected!')

	socket.write(JSON.stringify({ type: 'watching', file: fileName }) + '\n')

	let watcher = fs.watch(fileName, () => {
		if (!fs.existsSync('./' + fileName)) {
			socket.write('File was deleted!')
		} else {
			// socket.write(
			// 	JSON.stringify({
			// 		type: 'changed',
			// 		file: fileName,
			// 		timestamp: Date.now()
			// 	}) + '\n'
			// )
			socket.write('{"type":"changed","fil')
			socket.write(
				'e":"' + fileName + '","timestamp":' + Date.now() + '}\n'
			)
		}
	})

	socket.on('close', () => {
		console.log('Subscriber has disconnected!')
		watcher.close()
	})
})

if (!fileName) throw new Error("File name isn't defined!")

if (!/^[\w\d]+\.[\w\d]+/.test(fileName)) throw new Error('Invalid file name!')

if (!fs.existsSync('./' + fileName)) throw new Error('File not found!')

server.listen(41234, () => {
	console.log('Server is listening ...')
})
