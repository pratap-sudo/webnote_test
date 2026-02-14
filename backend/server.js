// -------------------- server.js --------------------
const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const connectDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());
connectDB();

const convertedDir = path.join(__dirname, 'converted');
fs.mkdirSync(convertedDir, { recursive: true });
app.use('/converted', express.static(convertedDir));


app.use('/api', userRoutes);
app.use('/api/admin', adminRoutes);

app.listen(process.env.PORT, () => {
  console.log(`Server running on port ${process.env.PORT}`);
});

