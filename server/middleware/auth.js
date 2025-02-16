const jwt = require('jsonwebtoken');
const userModel = require('../Models/userModel');

const verifySocketToken = async (socket, next) => {
  try {
    const token = socket.handshake.auth.token; // Get token from handshake
    if (!token) return next(new Error('Authentication error'));

    const decoded = jwt.verify(token, process.env.JWT_SECRET); // Verify token
    const user = await userModel.findById(decoded.id); // Fetch user from DB

    if (!user) return next(new Error('User not found'));

    socket.userId = user._id.toString(); // Attach userId to socket
    next(); // Proceed with the connection
  } catch (error) {
    next(new Error('Authentication error'));
  }
};

module.exports = {
  verifySocketToken,
};
