let visa = require('./ni-visa.js');
let vcon = require('./ni-visa-constants.js');

/*================================================================*/

var express = require('express');
var app = express();
var path = require('path');
var server = app.listen(3000, function(){console.log("Server listening on port 3000")});
// var http = require('http').Server(app);
// var io = require('socket.io')(http);
var io = require('socket.io').listen(server);
var public = path.join(__dirname, 'public');

var defaultAddress = 'USB0::0x0B5B::0xFFF9::1630010_7880_57::INSTR';

// server.configure(function(){
//   // server.use('/media', express.static(__dirname + '/media'));
//   server.use(app.static(__dirname + '/public'));
// });

app.use('/', express.static('./'));

app.get('/',function(req,res){
    res.sendFile('index.html');
});

/*=================================================*/

var rcvMsg;
io.on('connection',function(socket){

    // 01
    io.emit('socket-ready');
    
    // 02
    socket.on('get-devices', function(){
        var deviceList = getDeviceList('*IDN?');
        // 03
        deviceList.then(function(res){
            // console.log(res);
            io.emit('device-list', res);
        })
    });

    // 04
    socket.on('command', function(dataObj) {
        var deviceList = sendSCPI(dataObj.addr, dataObj.cmd);
        // 03
        deviceList.then(function(res){
            console.log(res);
            io.emit('command-success', res);
        })
        // 05
    });

    // 06
    socket.on('get-scanner-manual', function(data){
        startScannerTestingManual(data);
    });

    socket.on('get-scanner-init', function(address){
        startScannerTestingInit(address);
    });

    socket.on('get-scanner-auto', function(data){
        startScannerTestingAuto(data);
    });

    socket.on('toggleScreen', function(data){
        toggleScreen(data);
    });
});

/*================================================================*/

let status;
let sesn;

function getDeviceList(query){
    return new Promise((resolve, reject) => {
        let mainAddress = [];
        [status, sesn] = visa.viOpenDefaultRM();
        visa.vhListResources(sesn).forEach(address => {
            try {
                mainAddress.push(address);
            } catch (err) {
                console.log(err);
            } finally {
                return resolve(mainAddress);
            }
        });
      });   
}

function sendSCPI(address, query){
    var address = (address == "")? 'USB0::0x0B5B::0xFFF9::1630010_7880_57::INSTR' : address;
    console.log(">>", address)
    return new Promise((resolve, reject) => {
        // [status, sesn] = visa.viOpenDefaultRM();
        try {
            [status, vi] = visa.viOpen(sesn, address);
            resp = visa.vhQuery(vi, query);
            console.log(resp.trim());
            return resolve(resp);
            visa.viClose(vi);
        } catch (err) {
            console.log(err);
        } finally {
        }
      });
}

async function toggleScreen(data) {
    console.log(">", data)
    if(data.num === 2) var setPIMScreen = await sendSCPI(data.address, "SENSe:PIManalyzer:MODe PIM");
    if(data.num === 3) var PIMAnalyzerMode = await sendSCPI(data.address, ":INSTrument:NSELect 46");
    console.log("screen changed");
}

async function startScannerTestingManual(data) {
    var pimVsTime = await sendSCPI(data.address, "SENSe:PIManalyzer:MODe PIM");
    var power = await sendSCPI(data.address, ":PIManalyzer:OUTPut:POWer " + data.power);
    var duration = await sendSCPI(data.address, ":PIManalyzer:TEST:DURation " + data.duration);
    // var measure = await sendSCPI(data.address, "INITiate:PIManalyzer:MEASure ON");
    console.log("final >>>", power, duration)
}

async function startScannerTestingInit(address) {
    var pimVsTime = await sendSCPI(address, "SENSe:PIManalyzer:MODe PIM");
    var power = await sendSCPI(data.address, ":PIManalyzer:OUTPut:POWer " + data.power);
    var duration = await sendSCPI(data.address, ":PIManalyzer:TEST:DURation " + data.duration);
}

async function startScannerTestingAuto(data) {
    // var run = await sendSCPI(data.address, "INITiate:PIManalyzer:MEASure ON");
    var peakValue = await sendSCPI(data.address, ":PIManalyzer:MEASure:VALue?");
    io.emit('send-more', peakValue);
}

/*
let a, b, c, d, e = 0;
[status, a, b, c, d, e] = visa.viParseRsrc(sesn, deviceId[1]);
console.log(status, vcon.decodeStatus(status), a, b, c, d, e);
*/