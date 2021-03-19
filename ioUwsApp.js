const path = require('path');
const fs = require('fs');
const app = require('express')();
const server = require('http').Server(app);

const PORT = 3002;

app.get('/', (req, res) => {
	const url = path.resolve(__dirname, 'front', 'io.html');
	res.sendFile(url);
});

server.listen(PORT, () => {
	console.log(`Server is running on port ${PORT}`);
});

const io = require('socket.io')(server, {
	wsEngine: require('eiows').Server,
	perMessageDeflate: {
		threshold: 32768
	},
});

io.on('connection', function (socket) {
	console.log('Client connection received');
	const url = path.resolve(__dirname, 'data', 'img.jpg');

	fs.readFile(url, (err, data) => {
		if (err) {
			res.end(`Error getting the file: ${err}.`);
		} else {
			socket.emit('sendToClient', { image: data.toString('base64') });
		}
	});

	socket.on('disconnect', function () {
		console.log('Client disconnected');
	});
});
