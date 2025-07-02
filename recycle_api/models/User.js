const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: [3, 'Username must be at least 3 characters long'],
  },
  password: {
    type: String,
    required: true,
    minlength: [3, 'Password must be at least 3 characters long']
  },
  email: {
    type: String,
    required: false,
    trim: true,
    lowercase: true
  },
  refreshToken: {
    type: String
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  accumulatedPoints: [{
    material: { type: String, required: true },
    count: { type: Number, default: 0 }
  }],
  title: {
    type: Array,
    default: []
  }
});

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to check password validity
userSchema.methods.comparePassword = async function (candidatePassword) {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw error;
  }
};

const User = mongoose.model('User', userSchema);
module.exports = User;