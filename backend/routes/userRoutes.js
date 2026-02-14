// -------------------- routes/userRoutes.js --------------------
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const {
  registerUser,
  loginUser,
  getUserFiles,
  getPublicFiles,
  getPublicChannels,
  getChannelPublicFiles,
  updateChannelHandle,
  updateChannelLogo,
  uploadFile,
  deleteFile,
  convertFile
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
router.get('/public-data', getPublicFiles);
router.get('/channels', getPublicChannels);
router.get('/channels/:channelRef', getChannelPublicFiles);
router.patch('/channel-handle', protect, updateChannelHandle);
router.patch('/channel-logo', protect, upload.single('logo'), updateChannelLogo);
router.post('/upload', protect, upload.single('file'), uploadFile);
router.post('/delete', protect, deleteFile);
router.post('/convert', protect, upload.single('file'), convertFile);


module.exports = router;
