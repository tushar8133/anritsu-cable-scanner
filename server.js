var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var visafile = require('./visa.js').features;

app.get('/',function(req,res){
    res.sendfile('index.html');
});
var rcvMsg;
io.on('connection',function(socket){

	// 01
	io.emit('socket-ready');
    
    // 02
    socket.on('get-devices', function(){
        var deviceList = visafile.getConnectedDevices();
        // 03
        io.emit('device-list', deviceList);
    });

    // 04
    socket.on('command', function(dataObj) {
    	var rcvMsg = visafile.visa32TestQuery(dataObj.addr, dataObj.cmd);
    	// 05
        io.emit('command-success', rcvMsg);
    })
});

http.listen(3000,function(){
    console.log('listen 3000 port');
});
