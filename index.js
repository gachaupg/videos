import express from 'express';
import multer from 'multer';
import Client from 'ssh2-sftp-client';
import cors  from "cors";

const app = express();
const upload = multer({ dest: 'uploads/' }); // Destination folder for uploaded files

const config = {
  host: 'rbx111.truehost.cloud',
  port: '1624',
  username: 'akcreativ',
  password: 'H0h0Pu9a-[mYT8'
};
const corsOptions ={
  origin:'*', 
  credentials:true,            //access-control-allow-credentials:true
  optionSuccessStatus:200,
}


// const app = express();


app.use(cors());
const sftp = new Client();

// API endpoint for file upload
app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const file = req.file; // Access the uploaded file via req.file

    if (!file) {
      return res.status(400).json({ error: 'Missing file' });
    }

    await sftp.connect(config);
    console.log('Connected to SFTP server');

    // Assuming you want to upload the file to a remote path named "remotePath"
    await sftp.put(file.path, file.originalname);

    console.log('File uploaded successfully!');
    sftp.end(); // Close the SFTP connection

    res.status(200).json({ message: 'File uploaded successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred during file upload' });
  }
});


app.get('/videos', async (req, res) => {
  try {
    await sftp.connect(config);
    console.log('Connected to SFTP server');

    // Get the list of files in the root directory
    const fileList = await sftp.list('/');

    const videos = fileList
      .filter((file) => file.type === 'file' && file.name.endsWith('.mp4'))
      .map((video) => ({
        name: video.name,
        url: `https://rbx111.truehost.cloud/${video.name}`,
      }));

   

    const allVideos = [...videos, ...additionalVideos];

    sftp.end(); // Close the SFTP connection
    res.status(200).json(allVideos);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: 'An error occurred while fetching videos' });
  }
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});