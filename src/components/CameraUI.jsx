import { useState, useRef, useEffect } from 'react';


function CameraUI({ onCapture, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [stream, setStream] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera not supported in this browser');
        }

        const mediaStream = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            facingMode: 'environment',
            width: { ideal: 1280 },
            height: { ideal: 720 }
          } 
        });
        
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } catch (err) {
        setError(`Camera error: ${err.message}`);
        console.error('Camera setup failed:', err);
      }
    }

    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  async function handleCapture() {
    if (!videoRef.current) return;
  
    try {
      setIsCapturing(true);
      const video = videoRef.current;
      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0);
  
      // Convert to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.7);
      
      // Stop the camera stream after capturing
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
        setStream(null);
        if (videoRef.current) {
          videoRef.current.srcObject = null;
        }
      }
      
      // Send the image data to parent component
      onCapture(dataUrl);
    } catch (err) {
      setError(`Failed to capture photo: ${err.message}`);
    } finally {
      setIsCapturing(false);
    }
  }

  if (error) {
    return (
      <div className="camera-ui camera-ui--error">
        <div className="error-message">
          <p>{error}</p>
          <p>Please ensure camera permissions are granted and try again.</p>
        </div>
        <button className="btn btn__secondary" onClick={onClose}>
          Close
        </button>
      </div>
    );
  }

  return (
    <div className="camera-ui">
      <div className="camera-container">
        <video 
          ref={videoRef} 
          className="camera-preview" 
          autoPlay 
          playsInline
          muted
        />
      </div>  
      <div className="camera-controls">
        <button 
          className="btn btn__primary camera-btn"
          onClick={handleCapture}
          disabled={isCapturing || !stream}
        >
          {isCapturing ? 'Capturing...' : 'Take Photo'}
        </button>
        <button 
          className="btn btn__secondary" 
          onClick={onClose}
        >
          Cancel
        </button>
      </div>
    </div>
  );
}

export default CameraUI;