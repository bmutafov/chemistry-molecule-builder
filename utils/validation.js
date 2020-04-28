const Joi = require('@hapi/joi');

// Format the response object in case of error
// so that the front-end can handle it
const onError = error => {
    const errorResponseObj = error.details.map(e => ({
        context: e.context.key,
        message: e.message,
    }));
    return { error: true, data: errorResponseObj };
};

// Template for error
const errorMessage = message => ({
    error: true,
    data: [
        {
            context: 'global',
            message: message,
        },
    ],
});

const registerValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required(),
        confirmPassword: Joi.any().valid(Joi.ref('password')).required(),
    });

    const { error } = schema.validate(data, {
        abortEarly: false,
    });

    return error ? onError(error) : null;
};

const loginValidation = data => {
    const schema = Joi.object({
        username: Joi.string().min(4).required(),
        password: Joi.string().min(6).required(),
    });

    const { error } = schema.validate(data, {
        abortEarly: false,
    });

    return error ? onError(error) : null;
};

const moleculeValidation = data => {
    const schema = Joi.object({
        name: Joi.string().required(),
        formula: Joi.string().required(),
        solution: Joi.array().required(),
    });

    const { error } = schema.validate(data, {
        abortEarly: false,
    });

    return error ? onError(error) : null;
};

module.exports = {
    registerValidation,
    loginValidation,
    errorMessage,
    moleculeValidation,
};
