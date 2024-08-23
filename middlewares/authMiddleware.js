const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; 

  if (!token) {
    return res.status(401).json({ error: 'Unauthorized', message: 'Please login first' });
  }

  jwt.verify(token, 'secret', (err, user) => {
    if (err) return res.status(403).json({ error: 'Forbidden', message: 'Invalid token' });
    req.user = user;
    next();
  });
}

module.exports = authenticateToken;




