exports.features = {
	visa32TestQuery: Visa32TestQuery,
	getConnectedDevices: getConnectedDevices	
}

function Visa32TestQuery(visaAddress, queryString){
	return visaAddress +" | "+ queryString;
};

function getConnectedDevices() {
	return ["GPIB0::22::INSTR>>>WMAAnritsu", "USB0::22::INSTRWMBAnritsu"];
}