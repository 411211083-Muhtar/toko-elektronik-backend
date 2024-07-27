const db = require('../db');
const bcrypt = require('bcrypt');

// Create a new user
exports.createUser = async (username, email, password, role) => {
  const hashedPassword = await bcrypt.hash(password, 10);
  return new Promise((resolve, reject) => {
    db.query('INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)', [username, email, hashedPassword, role], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results.insertId);
    });
  });
};

// Find user by email
exports.findUserByEmail = (email) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
  });
};

// Find user by id
exports.findUserById = (user_id) => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users WHERE user_id = ?', [user_id], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results[0]);
    });
  });
};

exports.getAllUsers = () => {
  return new Promise((resolve, reject) => {
    db.query('SELECT * FROM users', (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};
