// -------------------- controllers/userController.js --------------------
const User = require('../models/User');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const supabase = require('../config/supabase');


exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  const hashed = await bcrypt.hash(password, 10);
  try {
    const user = await User.create({ name, email, password: hashed });
    res.status(201).json({ message: 'User registered' });
  } catch (err) {
    res.status(400).json({ message: 'Email already exists' });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(404).json({ message: 'User not found' });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).json({ message: 'Invalid credentials' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token });
};

exports.getUserFiles = async (req, res) => {
  res.json({ files: req.user.files });
};

exports.uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const file = req.file;

    // unique filename
    const fileName = `${Date.now()}-${file.originalname}`;
    const filePath = `user-${req.user._id}/${fileName}`;

    // upload to Supabase
    const { error } = await supabase.storage
      .from('uploads')
      .upload(filePath, file.buffer, {
        contentType: file.mimetype
      });

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // get public URL
    const { data } = supabase.storage
      .from('uploads')
      .getPublicUrl(filePath);

    // save URL in MongoDB
    req.user.files.push(data.publicUrl);
    await req.user.save();

    res.json({
      message: 'File uploaded to Supabase',
      url: data.publicUrl
    });

  } catch (err) {
    res.status(500).json({ message: 'Upload failed' });
  }
};


exports.deleteFile = async (req, res) => {
  try {
    const { fileUrl } = req.body;

    if (!fileUrl) {
      return res.status(400).json({ message: 'File URL required' });
    }

    // 1️⃣ Extract Supabase file path from URL
    // Example URL:
    // https://xxxx.supabase.co/storage/v1/object/public/uploads/user-123/file.png

    const bucketName = 'uploads';
    const filePath = fileUrl.split(`/storage/v1/object/public/${bucketName}/`)[1];

    if (!filePath) {
      return res.status(400).json({ message: 'Invalid file URL' });
    }

    // 2️⃣ Remove file from Supabase Storage
    const { error } = await supabase
      .storage
      .from(bucketName)
      .remove([filePath]);

    if (error) {
      return res.status(500).json({ message: error.message });
    }

    // 3️⃣ Remove file URL from MongoDB
    req.user.files = req.user.files.filter(file => file !== fileUrl);
    await req.user.save();

    res.json({ message: 'File deleted successfully' });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Delete failed' });
  }
};

