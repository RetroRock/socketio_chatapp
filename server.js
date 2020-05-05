const app = require('express')();
const http = require('http').createServer(app);
const io = require('socket.io')(http);

const port = 8000;

let connectedUsers = {};

app.get('/', (req, res) => {
	res.send('Hello world');
});

io.on('connection', (socket) => {
	const userId = connectedUsers[1000] ? Object.keys(connectedUsers).map(k => parseInt(k, 10)).reduce((a, b) => Math.max(a, b)) + 1 : 1000;
	connectedUsers[userId] = {'nickname': 'Stranger'};

	io.emit('new user', connectedUsers);
	
	socket.on('chat message', (data) => {
		console.log('[MESSAGE]: ' + connectedUsers[userId].nickname + ': ' + data.message);
		data['nickname'] = connectedUsers[userId].nickname;
			  console.log(data);
		socket.broadcast.emit('chat message', data);
	});

	socket.on('name change', (data) => {
		connectedUsers[userId].nickname = data.newName;
		io.emit('new user', connectedUsers);
	});

	socket.on('disconnect', () => {
		delete connectedUsers[userId];
		console.log('[USER DISCONNECT]');
	});
});

http.listen(8000, () => {
	console.log('[LISTENING *:' + port + ']');
});
