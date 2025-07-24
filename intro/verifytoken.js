const jwt = require('jsonwebtoken');

const verifytoken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'No token provided' });
    }

    const token = authHeader.split(' ')[1];  // Extract token from "Bearer <token>"

    jwt.verify(token, 'secretkey', (err, decoded) => {
      if (err) {
        return res.status(403).json({ message: 'Invalid token' });
      }

     // console.log('Decoded token:', decoded);  // Debug: See token contents

      req.user = decoded;  // Attach decoded payload to req.user
      next();
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Token verification failed' });
  }
};

module.exports = verifytoken;
