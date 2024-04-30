function checkParams(schema) {
	return (req, res, next) => {
		const validationResult = schema.validate(req.params);
		if (validationResult.error) {
			return res.status(400).send(validationResult.error.message);
		} else {
			next();
		}
	}
}

function checkBody(schema) {
	return (req, res, next) => {
		const validationResult = schema.validate(req.body);
		if (validationResult.error) {
			return res.status(400).send(validationResult.error.message);
		} else {
			next();
		}
	}
}

module.exports = {
	checkParams,
	checkBody
}