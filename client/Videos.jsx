import React, { useEffect, useState } from 'react';

function VideoList() {
  const [videoUrls, setVideoUrls] = useState([]);

  useEffect(() => {
    // Fetch video URLs from your server's API
    fetch('http://localhost:5000/videos/')
      .then((response) => response.json())
      .then((data) => {
        setVideoUrls(data);
      })
      .catch((error) => {
        console.error('Error fetching video URLs:', error);
      });
  }, []);

  return (
    <div>
      <h2>Video List</h2>
      <ul>
        {videoUrls.map((videoUrl, index) => (
          <li key={index}>
            <video width="320" height="240" controls>
              <source src={videoUrl.data} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default VideoList;
