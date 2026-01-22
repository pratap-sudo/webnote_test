// -------------------- routes/userRoutes.js --------------------
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const {
  registerUser,
  loginUser,
  getUserFiles,
  uploadFile,
  deleteFile
} = require('../controllers/userController');

const protect = require('../middleware/authMiddleware');

const router = express.Router();

// multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/'),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

const upload = multer({
  storage: multer.memoryStorage()
});


router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/account', protect, getUserFiles);
router.post('/upload', protect, upload.single('file'), uploadFile);
router.post('/delete', protect, deleteFile);


module.exports = router;
