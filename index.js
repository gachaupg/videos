import express from 'express';
import mysql from 'mysql';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url'; // Import the fileURLToPath function

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const corsOptions = {
  origin: '*', 
  credentials: true,
  optionSuccessStatus: 200,
};

const PORT = 5000;
const app = express();
app.use('/videos', express.static(path.join(__dirname, 'public/videos')));

// Middleware
app.use(cors(corsOptions));
app.use(express.json());

// Multer file storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.join(__dirname, 'public/videos'));
    },
    filename: (req, file, cb) => {
      cb(null, file.fieldname + "_" + Date.now() + path.extname(file.originalname));
    },
  });
  
  const upload = multer({ storage: storage });
  
  // MySQL database connection
  const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'peter',
  });
  
  // Connect to the database
  db.connect((err) => {
    if (err) {
      console.error('Database connection error:', err);
    } else {
      console.log('Connected to the database');
    }
  });
  
  // Serve video files as static content
  app.use('/videos', express.static(path.join(__dirname, 'public/videos')));
  
  // API endpoint for file upload
  app.post('/upload', upload.single('video'), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }
  
    const videoFilename = req.file.path;
    
    const videoPath = `${videoFilename}`; // Construct the video path relative to your server
  console.log(videoFilename);
    // Insert the video path into the database
    const sql = "INSERT INTO test (file) VALUES (?)";
  
    db.query(sql, [videoPath], (err, result) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error updating database' });
      }
  
      // Construct the full video URL based on your server's location
      const fullVideoUrl = `http://your-server-domain:${PORT}${videoPath}`;
      
      return res.json({ Status: 'Success', videoUrl: fullVideoUrl });
    });
  });
  

// API endpoint for fetching video URLs
app.get('/videos', (req, res) => {
    const sql = 'SELECT file FROM test';
  
    db.query(sql, (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error fetching videos' });
      }
  
      const videoUrls = results.map((result) => ({data:result.file}));
      res.json(videoUrls);
    });
  });
  
  app.get('/', (req, res) => {
    res.send('Welcome to our online shop API...');
  });
  

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
