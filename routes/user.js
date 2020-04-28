const router = require('express').Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../model/User');
const {
    registerValidation,
    loginValidation,
    errorMessage,
} = require('../utils/validation');
const signToken = require('../utils/sign-token');

router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;

    // Field validation
    const validationError = registerValidation(req.body);

    if (validationError) {
        return res.status(400).send(validationError);
    }

    // Check for existing users
    const userOrMailExist = await User.findOne({
        $or: [{ username }, { email }],
    });

    if (userOrMailExist) {
        return res
            .status(400)
            .send(errorMessage('Username or email is already registered.'));
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new user
    const user = new User({
        username,
        email,
        password: hashPassword,
    });

    try {
        const savedUser = await user.save();
        const token = signToken(savedUser);

        res.header('auth-token', token).send({ error: false, data: { token } });
    } catch (err) {
        res.status(400).send(err);
    }
});

router.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const validationError = loginValidation(req.body);

    if (validationError) {
        return res.status(400).send(validationError);
    }

    const sendError = () => {
        return res
            .status(400)
            .send(errorMessage('Username or password is incorrect.'));
    };

    // CHECK USER CREDENTIALS
    const user = await User.findOne({ username });
    if (!user) return sendError();

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return sendError();

    // Create and assign token
    try {
        const token = signToken(user);

        res.header('auth-token', token).send({ error: false, data: { token } });
    } catch (err) {
        res.status(400).send(err);
    }
});

module.exports = router;
