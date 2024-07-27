const jwt = require('jsonwebtoken');
require('dotenv').config();

// Pastikan ACCESS_TOKEN_SECRET ada di file .env Anda
const secret = process.env.ACCESS_TOKEN_SECRET;
if (!secret) {
  console.error('ACCESS_TOKEN_SECRET is not defined in .env');
  process.exit(1);
}

try {
  const token = jwt.sign({ user_id: 1, email: 'muhtar@mail.com' }, secret, { expiresIn: '1h' });
  console.log('Generated Token:', token);

  const decoded = jwt.verify(token, secret);
  console.log('Decoded Token:', decoded);
} catch (err) {
  console.error('Error:', err.message);
}
