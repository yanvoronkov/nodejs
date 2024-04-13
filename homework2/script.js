'use strict';

const generatePasswordOnlyNumbers = require('./genPassOnlyNumbers');
const generatePasswordOnlyLetters = require('./genPassOnlyNumbers');

// Generate password with numbers, letters and simbols
function generatePassword(length) {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+';
	const charactersLength = characters.length;
	for (let i = 0; i < length; i++) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
	}
	return result;
}


module.exports = {
	generatePassword
}