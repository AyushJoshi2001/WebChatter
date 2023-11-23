const asyncHandler = require('express-async-handler');

const accessChat = asyncHandler(async (req, res, next) => {
    console.log('accessChat is called');
    
})

const fetchChats = asyncHandler(async (req, res, next) => {
    console.log('fetchChats is called');

})

const createGroupChat = asyncHandler(async (req, res, next) => {
    console.log('createGroupChat is called');

})

const renameGroup = asyncHandler(async (req, res, next) => {
    console.log('renameGroup is called');

})

const removeFromGroup = asyncHandler(async (req, res, next) => {
    console.log('removeFromGroup is called');

})

const addToGroup = asyncHandler(async (req, res, next) => {
    console.log('addToGroup is called');

})

module.exports = { 
    accessChat,
    fetchChats,
    createGroupChat,
    renameGroup,
    removeFromGroup,
    addToGroup
}