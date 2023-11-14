const mongoose = require('mongoose');

const userSchema = mongoose.Schema(
    {
        name: {type: String, required: true},
        email: {type: String, required: true},
        password: {type: String, required: true},
        profileImg: {
            type: String,
            default: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCJKM1YzdZZGiPEnxzk9qYuWXQN_3PRzmlAsr3I6YrRPM7a18OO3X4rXnQUNDrWlJkcLo&usqp=CAU'
        }
    },
    {timestamps: true}
)

const User = mongoose.model("User", userSchema);
module.exports = User;