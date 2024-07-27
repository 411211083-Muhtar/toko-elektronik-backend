// const jwt = require('jsonwebtoken');

const authenticateAdmin = (req, res, next) => {
  // const token = req.headers.authorization && req.headers.authorization.split(' ')[1];
  // if (!token) {
  //   return res.status(403).json({ message: 'No token provided' });
  // }

  try {
    // const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    // req.user = decoded;

  // jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
  //   if (err) {
  //     return res.status(403).json({ message: 'Invalid token' });
  //   }
  //   if (user.role !== 'admin') {
  //     return res.status(403).json({ message: 'Access denied' });
  //   }
    req.user = { user_id: 1, email: 'muhtar@mail.com' };
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
  
};

module.exports = { authenticateAdmin };
