import './styles.scss';
import io from 'socket.io-client';

const socket = io();

const users = document.getElementById('users');
const messages = document.getElementById('messages');
const messageForm = document.getElementById('m');
const nickForm = document.getElementById('nick');
const nick = document.querySelector('#nick input');
const inputMessage = document.querySelector('#m input');

function appendMessage(data) {
	let message = document.createElement('li');
		  console.log(data);
	let messageText = document.createTextNode((data.nickname ? data.nickname : 'You') + ': ' + data.message);
	message.append(messageText);
	messages.append(message);
}

nickForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const data = {
			  	newName: nick.value
	};
	socket.emit('name change', data);
});

messageForm.addEventListener('submit', (e) => {
	e.preventDefault();
	const data = {
		message: inputMessage.value
	};
	socket.emit('chat message', data);
	appendMessage(data);
	inputMessage.value = '';
});

socket.on('new user', (data) => {
		  console.log(data);
		
	users.innerHTML = Object.values(data).map(v => v.nickname).join(', ');
});

socket.on('chat message', (data) => {
	appendMessage(data);
});



