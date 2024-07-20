import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import xtraBetVideo from '../images/eXTRABET.mp4'; // Replace with your video URL

function Loading({ onLoaded }) {
  const [videoLoaded, setVideoLoaded] = useState(false);

  useEffect(() => {
    // Use a timer to trigger onLoaded after 3 seconds
    const timer = setTimeout(() => {
      if (videoLoaded) {
        onLoaded();
      }
    }, 3000); // 3 seconds

    // Cleanup timer if the component unmounts
    return () => clearTimeout(timer);
  }, [videoLoaded, onLoaded]);

  const handleVideoLoaded = () => {
    setVideoLoaded(true); // Set videoLoaded to true when the video starts playing
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }} // Adjust transition duration as needed
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: '#000', // Fallback color
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
        overflow: 'hidden', // Ensure video covers the screen
      }}
    >
      <div
        style={{
          position: 'relative',
          width: '80%', // Adjust width as needed
          maxWidth: '600px', // Max width for larger screens
          height: 'auto',
          paddingTop: '56.25%', // Aspect ratio 16:9
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <video
          id="loadingVideo"
          src={xtraBetVideo}
          autoPlay
          muted
          playsInline
          onLoadedData={handleVideoLoaded} // Handle video load
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
          }}
        />
      </div>
    </motion.div>
  );
}

export default Loading;
