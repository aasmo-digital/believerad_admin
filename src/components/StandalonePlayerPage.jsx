// src/components/StandalonePlayerPage.js
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom'; // useLocation removed as it was unused
import useLocationSlots from '../hooks/useLocationSlots';
import MediaRoomPlayer from '../pages/MediaRoomPlayer';

const StandalonePlayerPage = () => {
  const { locationId } = useParams();
  // const location = useLocation(); // This was unused, so removed.
  const { slots, loading, error } = useLocationSlots(locationId);
  const [playerUrl, setPlayerUrl] = useState('');
  const [embedCode, setEmbedCode] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const currentUrl = window.location.href;
    setPlayerUrl(currentUrl);

    const defaultWidth = "800";
    const defaultHeight = "600";
    setEmbedCode(`<iframe src="${currentUrl}" width="${defaultWidth}" height="${defaultHeight}" frameborder="0" allow="autoplay; fullscreen" allowfullscreen></iframe>`);
  }, []); // Empty dependency array ensures this runs only once on mount

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(embedCode)
      .then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2000); // Reset copied status after 2 seconds
      })
      .catch(err => {
        console.error('Failed to copy embed code: ', err);
        alert('Failed to copy. Please try again or copy manually.');
      });
  };

  const pageStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center',
    height: '100vh',
    width: '100vw',
    backgroundColor: '#000',
    color: 'white',
    margin: 0,
    // padding: '20px 0', // Add some padding for content at top/bottom
    boxSizing: 'border-box',
    overflow: 'hidden',
    fontFamily: 'Arial, sans-serif',
  };

  const urlDisplayStyle = {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    padding: '10px 15px',
    margin: '0 0 10px 0', // Margin bottom to separate from embed code
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: 'bold',
    textAlign: 'center',
    width: '90%',
    maxWidth: '700px',
    wordBreak: 'break-all',
    border: '1px solid rgb(230, 250, 230)', // Corrected CSS
    boxShadow: '0 0 10px rgb(214, 240, 214)', // Corrected CSS
  };

  const embedCodeStyle = {
    backgroundColor: 'rgba(50, 50, 50, 0.8)',
    color: '#e0e0e0',
    padding: '15px',
    margin: '0 0 20px 0', // Margin bottom to separate from player
    borderRadius: '5px',
    fontSize: '14px',
    fontFamily: 'monospace',
    textAlign: 'left',
    width: '90%',
    maxWidth: '700px',
    wordBreak: 'break-all',
    border: '1px solid #444',
    position: 'relative', // For positioning the copy button
    boxSizing: 'border-box',
  };

  const copyButtonStyle = {
    position: 'absolute',
    top: '10px',
    right: '10px',
    padding: '6px 12px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '13px',
    fontWeight: 'bold',
  };

  const copiedMessageStyle = {
    ...copyButtonStyle,
    backgroundColor: '#28a745',
    cursor: 'default',
  };

  const playerWrapperStyle = {
    width: '100%',
    maxWidth: 'calc(100vh * (9/16))', // 9:16 aspect ratio
    margin: '0 auto', // Center horizontally
    flexGrow: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 0,
    aspectRatio: '9/16' // Explicit aspect ratio
  };

  const loadingErrorStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100%',
    width: '100%',
    textAlign: 'center',
  };

  const commonInfoSection = (
    <>
      {/* {playerUrl && (
        <div style={urlDisplayStyle}>
          Player Link: {playerUrl}
        </div>
      )}
      {embedCode && (
        <div style={embedCodeStyle}>
          <p style={{ margin: '0 0 10px 0', fontSize: '15px', fontWeight: 'bold', color: 'white' }}>Embed Code:</p>
          <pre style={{ margin: 0, whiteSpace: 'pre-wrap', color: '#f0f0f0', fontSize:'13px' }}>{embedCode}</pre>
          <button
            style={copied ? copiedMessageStyle : copyButtonStyle}
            onClick={handleCopyToClipboard}
            disabled={copied}
          >
            {copied ? 'Copied!' : 'Copy'}
          </button>
        </div>
      )} */}
    </>
  );

  if (loading) {
    return (
      <div style={pageStyle}>
        {commonInfoSection}
        <div style={loadingErrorStyle}>
          <p>Loading Player...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div style={pageStyle}>
        {commonInfoSection}
        <div style={loadingErrorStyle}>
          <p>Error loading media. Please try again later.</p>
        </div>
      </div>
    );
  }

  if (!slots || slots.length === 0) {
    return (
      <div style={pageStyle}>
        {commonInfoSection}
        <div style={loadingErrorStyle}>
          <p>No media found for this location at the moment.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageStyle}>
      {commonInfoSection}
      <div style={playerWrapperStyle}>
        <MediaRoomPlayer slots={slots} isContained={true} /> {/* Pass isContained={true} */}
      </div>
    </div>
  );
};

export default StandalonePlayerPage;