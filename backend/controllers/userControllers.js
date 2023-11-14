const asyncHandler = require('express-async-handler');

const registerUser = asyncHandler(async (req, res) => {
    const { name, email, password, profileImg } = req.body;

    if(!name || !email || !password) {
        res.send(400);    
        if(!name) {
            throw new Error('Name is missing.')
        }
        if(!email) {
            throw new Error('Email is missing.')
        }
        if(!password) {
            throw new Error('Password is missing.')
        }
    }

    // save details to DB.

    res.status(200).json(res.body);
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if(!email || !password) {
        if(!email) {
            throw new Error('Email is missing.')
        }
        if(!password) {
            throw new Error('Password is missing.')
        }
        res.send(400);
    }

    // authenticate user and send the user details.

    res.status(200).json(req.body);
})


module.exports = { registerUser, loginUser };