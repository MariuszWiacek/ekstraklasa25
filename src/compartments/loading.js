import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { BarLoader } from 'react-spinners';

import footballLogo from '../images/icon.png'; // Replace with your logo URL
import pitch from '../images/pitch.png'; // Ensure this is the correct path to your image

function Loading({ onLoaded }) {
  useEffect(() => {
    const img = new Image();
    img.src = pitch;
    img.onload = onLoaded;
  }, [onLoaded]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 2 }}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        background: `url(${pitch}) no-repeat center center fixed`,
        backgroundSize: 'cover',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{ position: 'absolute', textAlign: 'center' }}>
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <img src={footballLogo} alt="Football Logo" style={{ width: '400px', height: '300px', marginBottom: '20px' }} />
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1 }}
        >
          <h1 style={{ color: '#F5F5DC', margin: 0 }}>SUPERLIGA 2024</h1>
        </motion.div>
        <BarLoader height="3px" width="100%" size="70px" color="red" />
      </div>
    </motion.div>
  );
}

export default Loading;
