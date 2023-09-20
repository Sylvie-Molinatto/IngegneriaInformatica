'use-strict'

/* --------- ERROR MESSAGES --------- */
const ERROR_422 = {error: 'Unprocessable Entity'};

/* --------- EXPRESS VALIDATOR --------- */
const { validationResult } = require('express-validator');

function validationHandler(request, response, next) {

    const errors = validationResult(request);
    if (!errors.isEmpty()) {
        return response.status(422).json(ERROR_422);
    }

    next();
}

module.exports = { validationHandler };