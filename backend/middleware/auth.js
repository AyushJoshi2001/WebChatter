const asyncHandler = require('express-async-handler');
const jwt = require('jsonwebtoken');

const authorizeUser = asyncHandler(async (req, res, next) => {
    console.log('auth running');
    // authorize jwt token and verify user exist in the db.
    const authToken = req.headers.authorization;
    let userEmail;

    const verifyToken = await jwt.verify(authToken, process.env.JWT_SECRET_KEY, (err, data) => {
        if(err) {
            return false;
        }
        if(data) {
            userEmail = data?.email;
            req.headers.loggedInUserEmail = userEmail;
            return true;
        }
    })

    if(!verifyToken) {
        console.log('Unauthorized access.');
        res.status(403).json('Unauthorized');
    } else {
        next();
    }
})

module.exports = { authorizeUser };