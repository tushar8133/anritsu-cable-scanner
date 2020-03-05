var socket = io();

var counter = 0;

// 01
socket.on('socket-ready', function(){
    console.log("socket ready on server");
});

// 02
function getDeviceConnectionList(){
    socket.emit('get-devices');
}

// 03
socket.on('device-list', function(data){
    var select = document.getElementById("allDevices");
    select.innerHTML = "";
    for(var i = 0; i < data.length; i++) {
        var option = document.createElement('option');
        option.text = option.value = data[i];
        select.add(option, 0);
    }
});

// 04
function sendCommand(scpi){
    var address = document.getElementById('allDevices').value;
    window['deviceAddress'] = address;
    socket.emit('command', {addr: address, cmd: scpi});
}

// 05
socket.on('command-success', function(data){
    console.log("command success", data);
    // document.getElementById("textarea-scpi").innerHTML = "";
    document.getElementById("textarea-scpi").value = data;
});

function scannerReset(){
    document.getElementById("scanner").disabled = false;
    document.getElementById("scanner").value = "";
    document.getElementById("scanner").focus();
}

function scannerPause() {
    document.getElementById("scanner").disabled = true;
}

function scannerDetect(value){
    var str = "";
    if(value == "get-scanner-manual") {
        str = value;
    } else {
        str = "get-scanner-auto";
        scannerPause();
    }
    
    var address = window['deviceAddress'];
    var power = document.getElementById('outputPowerLevel').value;
    var duration = document.getElementById('testDuration').value;
    // 06
    socket.emit(str, {address: address, power: power, duration: duration});
}

function startScannerTesting() {
    counter = 0;
    scannerDetect("get-scanner-manual");
}

function toggleScreen(num) {
    var address = window['deviceAddress'];
    socket.emit('toggleScreen', {address: address, num: num});
}

function startScannerTestingInit(){
    var address = window['deviceAddress'];
    socket.emit('get-scanner-init', address);
}

function storeCableInfo(value){
    var address = window['deviceAddress'];
    var power = document.getElementById('outputPowerLevel').value;
    var duration = document.getElementById('testDuration').value;

    socket.emit('get-scanner-auto', {address: address, power: power, duration: duration});
}

socket.on('send-more', function(data){
    // if(!counter) {
    //     scannerReset();
    //     return;
    // }
    var oldData = document.getElementById("textarea-scanner").value;
    var serialNumber = document.getElementById("scanner").value;
    var peakValue = formatPeakData(data);
    var date = new Date();
    document.getElementById("textarea-scanner").value = `${oldData}\n\n${++counter} >> ${serialNumber} >> ${peakValue} >> ${date}`;
    scannerReset();
});

function formatPeakData(data) {
    var arr = data.split(",");
    arr[0] = ' ' + arr[0] + ' dBc';
    arr[1] = arr[1] + ' dBm';
    arr.reverse();
    var final = arr.join();
    return final;
}