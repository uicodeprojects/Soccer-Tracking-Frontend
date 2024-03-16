import React, { useState, useEffect } from 'react';
import UploadComponent from './components/UploadComponent';
import BasicSpinner from './components/BasicSpinner';
import axios from 'axios';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import uploadIcon from './icons/cloud-upload-alt.png'; // Import the downloaded SVG icon
import playerDetectionIcon from './icons/identificacion-de-rostro.png';
import fieldDetectionIcon from './icons/cancha-de-futbol.png';
import teamAfiliationIcon from './icons/equipo.png';
import videoGenerationIcon from './icons/video.png';

const App = () => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [videoGeneratedStatus, setVideoGeneratedStatus] = useState('idle');

  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoGeneratedUrl, setVideoGeneratedUrl] = useState('');

  const getStyles = (status) => {
    return {
      container: {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        // Default style for idle status
        opacity: status === 'idle' ? 0.5 : 1,
        // Highlight style for running status
        backgroundColor: status === 'in_progress' ? '#ffd700' : 'inherit',
        // Green background for success status
        backgroundColor: status === 'success' ? '#00ff00' : 'inherit',
      }
    };
  }

  useEffect(() => {
    const processVideo = async () => {
      if (!videoUrl || !videoId || uploadStatus !== 'success') {
        return;
      }
      setProcessingStatus('in_progress');
      console.log('Processing video:', videoUrl, videoId);
      try {
        const response = await axios.post('http://localhost:8080/process', {}, {
          params: {
            videoUrl: videoUrl,
            videoId: videoId
          }
        });
        if (response.status !== 200) {
          setProcessingStatus('error');
        }
        console.log('Video processed successfully:', response.data);
      } catch (error) {
        console.error('Error processing video:', error);
        alert('Error processing video. Please try again.');
        setProcessingStatus('error');
      } finally {
        setProcessingStatus('success');
      }
    };

    processVideo();
  }, [videoUrl, videoId, uploadStatus]);

  useEffect(() => {
    const generateVideo = async () => {
      if (!videoUrl || !videoId || processingStatus !== 'success') {
        return;
      }
      setVideoGeneratedStatus('in_progress');
      console.log('Generating video:', videoUrl, videoId);
      try {
        const response = await axios.post('http://localhost:8080/generate_video', {}, {
          params: {
            videoUrl: videoUrl,
            videoId: videoId
          }
        });

        if (response.status !== 200) {
          setVideoGeneratedStatus('error');
        }

        const videoUrl_temp = response.data; // Assuming the URL is directly returned in the response data
        console.log('Generated video URL:', videoUrl_temp);
        setVideoGeneratedUrl(response.data);
        console.log('Video generated successfully:', response.data);
      } catch (error) {
        console.error('Error generating video:', error);
        alert('Error generating video. Please try again.');
        setVideoGeneratedStatus('error');
      } finally {
        setVideoGeneratedStatus('success');
      }
    };

    generateVideo();
  }
    , [videoUrl, videoId, processingStatus]);

  // If the video is generated successfully, display the video URL
  return (
    <>
      <div className='containerTitle'>
        <h1>Soccer Tracking Data App</h1>
        <p> linkedid information plus project explaination </p>
      </div>
      <div className='containerUpload'>
        <h5>Please upload a video</h5>
        <UploadComponent setUploadStatus={setUploadStatus} setVideoUrl={setVideoUrl} setVideoId={setVideoId} />
      </div>
      <div className='containerFlow'>
        <div style={getStyles(uploadStatus).container}>
          <h3>1. Upload</h3>
          <img src={uploadIcon} alt="uploadIcon" style={{ width: '50px', height: '50px' }} />
          <BasicSpinner status={uploadStatus} />
          <hr />
        </div>
        <div className="containerProcessing">
          <div style={getStyles(processingStatus).container}>
            <h3>2. Player Detection (yolo)</h3>
            <img src={playerDetectionIcon} alt="playerDetectionIcon" style={{ width: '50px', height: '50px' }} />
            <BasicSpinner status={processingStatus} />
            <hr />
          </div>
          <div style={getStyles('idle').container}>
            <h3>3. Camera Calibration (Homography)</h3>
            <img src={fieldDetectionIcon} alt="fieldDetectionIcon" style={{ width: '50px', height: '50px' }} />
            <hr />
          </div>
        </div>
        <div style={getStyles('idle').container}>
          <h3>4. Team Affiliation</h3>
          <img src={teamAfiliationIcon} alt="teamAfiliationIcon" style={{ width: '50px', height: '50px' }} />
          <hr />
        </div>
        <div style={getStyles(videoGeneratedStatus).container}>
          <h3>5.Generate Video/Tracking Data (ByteTraker)</h3>
          <img src={videoGenerationIcon} alt="videoGenerationIcon" style={{ width: '50px', height: '50px' }} />
          <BasicSpinner status={videoGeneratedStatus} />
          <hr />
        </div>
      </div>
      <div className='containerVideos'>
        <div>
          <h2>Original Video</h2>
          {videoUrl && (
            <video width={640} height={480} controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
        <div>
          <h2>Annotated Video</h2>
          {videoGeneratedUrl && (
            <video width={640} height={480} controls>
              <source src={videoGeneratedUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          )}
        </div>
      </div >
    </>

  );
};

export default App;
