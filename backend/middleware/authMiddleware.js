const jwt = require('jsonwebtoken');
const Student = require('../models/Student');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');

    // ✅ Admin token (contains role, no id)
    if (decoded.role === 'admin') {
      req.student = { role: 'admin', isAdmin: true, _id: 'admin' };
      return next();
    }

    // Normal student
    const student = await Student.findById(decoded.id).select('-password');
    if (!student) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }
    req.student = student;
    next();
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid token' });
  }
};

exports.adminOnly = (req, res, next) => {
  if (req.student && (req.student.role === 'admin' || req.student.isAdmin)) {
    next();
  } else {
    res.status(403).json({ success: false, message: 'Admin only' });
  }
};