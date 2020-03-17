import io from 'socket.io-client';

var socket = io();

function connectMachine(cmd) {
	document.getElementById('spinner').style.display = 'block';
	var socketObj = {
		address: localStorage.getItem('address'),
		command: cmd
	};

	console.log(socketObj)

	socket.emit('comm', socketObj);
	
    return new Promise((resolve, reject) => {
        socket.on('comm', function(resp) {
            resolve(JSON.parse(resp));
			document.getElementById('spinner').style.display = 'none';
        });
    });
}

export default connectMachine;
