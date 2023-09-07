import axios from 'axios';
import React, { useState } from 'react';

const Upload = () => {
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!file) {
      console.log('No file selected');
      return;
    }

    const formData = new FormData();
    formData.append('video', file);

    try {
      const response = await axios.post('http://localhost:5000/upload', formData);
      if (response.data.Status === 'Success') {
        console.log('File uploaded successfully');
      } else {
        console.log('Error uploading file');
      }
    } catch (error) {
      console.error('Error uploading file', error);
    }
  };

  const handleFile = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div>
      <form onSubmit={handleSubmit} encType="multipart/form-data">
        <input type="file"  accept=".mp4, .avi" name="video" onChange={handleFile} />
        <button type="submit">Upload</button>
      </form>
    </div>
  );
};

export default Upload;
