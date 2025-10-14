const bcrypt = require('bcrypt');
const db = require('../models/db');
const { generateToken } = require('../utils/jwtUtils');

const SALT_ROUNDS = 12;

const signup = async (req, res) => {
  const { name, email, password } = req.body;

  // Basic validation
  if (!name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Name, email, and password are required'
    });
  }

  if (password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long'
    });
  }

  try {
    // Check if user already exists
    db.get('SELECT id FROM users WHERE email = ?', [email], async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Server error during signup'
        });
      }

      if (user) {
        return res.status(409).json({
          success: false,
          message: 'User with this email already exists'
        });
      }

      try {
        // Hash password and create user
        const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
        
        db.run(
          'INSERT INTO users (name, email, password) VALUES (?, ?, ?)',
          [name.trim(), email.toLowerCase().trim(), hashedPassword],
          function(err) {
            if (err) {
              console.error('Error creating user:', err);
              return res.status(500).json({
                success: false,
                message: 'Failed to create user'
              });
            }

            res.status(201).json({
              success: true,
              message: 'User created successfully! Please login to continue.',
              data: {
                user: {
                  id: this.lastID,
                  name: name.trim(),
                  email: email.toLowerCase().trim()
                }
              }
            });
          }
        );
      } catch (hashError) {
        console.error('Password hashing error:', hashError);
        res.status(500).json({
          success: false,
          message: 'Server error during signup'
        });
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const login = (req, res) => {
  const { email, password } = req.body;

  // Basic validation
  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  db.get(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Server error during login'
        });
      }

      if (!user) {
        return res.status(401).json({
          success: false,
          message: 'Invalid email or password'
        });
      }

      try {
        const isPasswordValid = await bcrypt.compare(password, user.password);
        
        if (!isPasswordValid) {
          return res.status(401).json({
            success: false,
            message: 'Invalid email or password'
          });
        }

        const token = generateToken({
          id: user.id,
          email: user.email,
          name: user.name
        });

        res.json({
          success: true,
          message: 'Login successful',
          data: {
            token,
            user: {
              id: user.id,
              name: user.name,
              email: user.email
            }
          }
        });
      } catch (compareError) {
        console.error('Password comparison error:', compareError);
        res.status(500).json({
          success: false,
          message: 'Server error during login'
        });
      }
    }
  );
};

const getProfile = (req, res) => {
  db.get(
    'SELECT id, name, email, created_at FROM users WHERE id = ?',
    [req.user.id],
    (err, user) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Server error fetching profile'
        });
      }

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found'
        });
      }

      res.json({
        success: true,
        data: { user }
      });
    }
  );
};

// Update user profile
const updateProfile = (req, res) => {
  const { name } = req.body;
  const userId = req.user.id;

  if (!name || name.trim() === '') {
    return res.status(400).json({
      success: false,
      message: 'Name is required'
    });
  }

  db.run(
    'UPDATE users SET name = ? WHERE id = ?',
    [name.trim(), userId],
    function(err) {
      if (err) {
        console.error('Profile update error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to update profile'
        });
      }

      // Get updated user
      db.get(
        'SELECT id, name, email, created_at FROM users WHERE id = ?',
        [userId],
        (err, user) => {
          if (err) {
            console.error('User fetch error:', err);
            return res.status(500).json({
              success: false,
              message: 'Profile updated but failed to fetch user details'
            });
          }

          res.json({
            success: true,
            message: 'Profile updated successfully',
            data: { user }
          });
        }
      );
    }
  );
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile
};