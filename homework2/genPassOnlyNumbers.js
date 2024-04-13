'use strict';

// Generate password only numbers
function generatePasswordOnlyNumbers(length) {
	let result = '';
	const characters = '0123456789';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}

module.exports = {
	generatePasswordOnlyNumbers
}