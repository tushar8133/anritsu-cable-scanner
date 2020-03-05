/**
 * Copyright (C) Peter Torelli
 *
 * Licensed under Apache 2.0
 * 
 * Just a test area.
 */

let visa = require('./ni-visa.js');
let vcon = require('./ni-visa-constants.js');
let status;
let sesn;
let deviceId = [];

let query = ["*IDN?", ":MMEMory:STORe:JPEG 'tushar2'"];
[status, sesn] = visa.viOpenDefaultRM();
console.log("testing resource scan..");
visa.vhListResources(sesn).forEach(address => {
	try {
	[status, vi] = visa.viOpen(sesn, address);
	resp = visa.vhQuery(vi, query[0]);
	// console.log("");
	console.log(address, resp.trim());
	deviceId.push(resp.trim());
	// console.log();
	visa.viClose(vi);
	} catch (err) {
	// console.log(">>",address)
	} finally {
	// console.log("=========================");
	}
});

console.log("");
console.log("testing parse resource");

let a, b, c, d, e = 0;
[status, a, b, c, d, e] = visa.viParseRsrc(sesn, deviceId[1]);
console.log(status, vcon.decodeStatus(status), a, b, c, d, e);
