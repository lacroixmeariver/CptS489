// helps prevent user from banning/modifying their own account
const isSelf = (req, paramID) => parseInt(paramID) === req.user.UserID;

module.exports = { isSelf };
