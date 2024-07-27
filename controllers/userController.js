require('dotenv').config();
console.log('ACCESS_TOKEN_SECRET:', process.env.ACCESS_TOKEN_SECRET); // Pastikan variabel lingkungan terbaca

// const jwt = require('jsonwebtoken'); // disable sementara
const bcrypt = require('bcrypt');
const User = require('../models/user');

exports.login = async (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email, password); // Log input login

  try {
    const user = await User.findUserByEmail(email);
    if (!user) {
      console.log('User not found');
      return res.status(404).json({ error: 'User not found' });
    }

    console.log('User found:', user); // Log ketika pengguna ditemukan

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      console.log('Invalid password');
      return res.status(401).json({ error: 'Invalid password' });
    }

    console.log('Password valid'); // Log ketika password valid

    // disable sementara utk pembuatan token
    // const token = jwt.sign(
    //   { user_id: user.user_id, email: user.email },
    //   process.env.ACCESS_TOKEN_SECRET,
    //   { expiresIn: '1h' }
    // );

    // console.log('Generated Token:', token); // Log token yang dihasilkan

    // Ubah respons untuk sementara tanpa token
    // res.json({ token });

    // Sementara berikan respon berhasil tanpa token
    res.json({ message: 'Login successful', user: { user_id: user.user_id, email: user.email } });
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ error: err.message });
  }
};
