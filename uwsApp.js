const path = require('path');
const fs = require('fs');
const uws = require('uWebSockets.js');

const PORT = 3001;

uws.App({
	key_file_name: 'misc/key.pem',
	cert_file_name: 'misc/cert.pem',
}).ws('/', {
	compression: 0,
	maxPayloadLength: 16 * 1024 * 1024 * 100000,
	idleTimeout: 60,

	open: (ws, req) => {
		const url = path.resolve(__dirname, 'data', 'img.jpg');
		fs.readFile(url, (err, data) => {
			if (err) {
				res.end(`Error getting the file: ${err}.`);
			} else {
				ws.send(data.toString('base64'));
			}
		});
	},
	close: (ws, code, message) => {
		console.log('Client disconnected');
	}

}).get('/', (res, req) => {
	const url = path.resolve(__dirname, 'front', 'uws.html');
	let file = fs.readFileSync(url, function (err, data) {
		if (err) {
			res.end(`Error getting the file: ${err}.`);
		} else {
			res.writeHeader('Content-type', 'text/html');
			res.end(data);
		}
	});
	res.end(file);

}).listen(PORT, token => {
	token ?
		console.log(`Uws listening to port ${PORT}`) :
		console.log(`Failed to listen to port ${PORT}`);
});