const jwt = require('jsonwebtoken');

const signToken = user => {
    const token = jwt.sign(
        {
            _id: user._id,
        },
        process.env.TOKEN_SECRET
    );

    return token;
};

module.exports = signToken;
