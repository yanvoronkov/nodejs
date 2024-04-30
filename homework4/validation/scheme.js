const joi = require('joi');

const userSchema = joi.object({
	name: joi.string().min(3).required(),
	age: joi.number().min(18).max(120).required()
});

const idSchema = joi.object({
	id: joi.number().required()
});

module.exports = {
	userSchema,
	idSchema
}