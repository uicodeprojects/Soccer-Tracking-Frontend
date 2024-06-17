import React, { useState, useEffect } from 'react';
import { BACKEND_IP } from './constants';
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
import videoEmptyIcon from './icons/video_empty.png';

const App = () => {
  const [uploadStatus, setUploadStatus] = useState('idle');
  const [processingStatus, setProcessingStatus] = useState('idle');
  const [videoGeneratedStatus, setVideoGeneratedStatus] = useState('idle');

  const [videoUrl, setVideoUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [videoGeneratedUrl, setVideoGeneratedUrl] = useState('');
  const [disabledButton, setDisabledButton] = useState(false);

  const getStyles = (status) => {
    return {
      container: {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '5px',
        // Default style for idle status
        opacity: status === 'idle' ? 0.5 : 1,
        // Highlight style for running status,  Green background for success status  Red background for error status
        backgroundColor: status === 'in_progress' ? '#f0f0f0' : status === 'success' ? '#d4edda' : status === 'error' ? '#f8d7da' : '#fff'
      }
    };
  }


  useEffect(() => {
    const processVideo = async () => {
      if (!videoUrl || !videoId || uploadStatus !== 'success') {
        return;
      }
      setProcessingStatus('in_progress');
      try {
        const response = await axios.post(`${BACKEND_IP}/process`, {}, {
          params: {
            videoUrl: videoUrl,
            videoId: videoId
          }
        });
        if (response.status !== 200) {
          setProcessingStatus('error');
          setDisabledButton(false);
        }

      } catch (error) {
        console.error('Error processing video:', error);
        alert('Error processing video. Please try again.');
        setProcessingStatus('error');
        setDisabledButton(false);
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
      try {
        const response = await axios.post(`${BACKEND_IP}/generate_video`, {}, {
          params: {
            videoUrl: videoUrl,
            videoId: videoId
          }
        });

        if (response.status !== 200) {
          setVideoGeneratedStatus('error');
          setDisabledButton(false);
        }

        const videoUrl_temp = response.data; // Assuming the URL is directly returned in the response data
        setVideoGeneratedUrl(response.data);
      } catch (error) {
        console.error('Error generating video:', error);
        alert('Error generating video. Please try again.');
        setVideoGeneratedStatus('error');
        setDisabledButton(false);
      } finally {
        setVideoGeneratedStatus('success');
        setDisabledButton(false);
      }
    };

    generateVideo();
  }
    , [videoUrl, videoId, processingStatus]);

  // If the video is generated successfully, display the video URL
  return (
    <>
      <div className='containerTitle'>
        <h1 className='tittle'> Soccer Tracking Data App</h1>
      </div>
      <div className='containerDescription'>
        <p>Welcome to our <em><b>Soccer Player Tracking Web App!</b></em> Currently under development, this application is designed to extract raw tracking data from short soccer broadcast videos.
          <h4 className='titleHowToUse'>How to use</h4>
          At this stage, the app offers annotated videos showcasing player tracking. We are actively working on Steps 3 and 4 to enrich the user experience.</p>
        <p> To experience our app, simply upload a short soccer broadcast video, ideally no longer than 35 seconds. For your convenience, sample videos are available in the Kaggle competition
          <a href="https://www.kaggle.com/competitions/dfl-bundesliga-data-shootout/data?select=clips" target="_blank" rel="noopener noreferrer"> DFL - Bundesliga Data Shootout</a>.
          Please note that the Player Detection process (Step 2) may take up to 3 minutes, plus the duration of your video.
          The initial 3-minute delay is attributed to booting our YOLO model, an aspect we are actively working to optimize.</p>
        <h4>Developer</h4>
        <p> This app is developed by <a href="https://www.linkedin.com/in/jc-campos/" target="_blank" rel="author">Juan Camilo Campos</a> </p>
      </div >
      <div className='containerUpload'>
        <h5>Please upload a video</h5>
        <UploadComponent setUploadStatus={setUploadStatus} setProcessingStatus={setProcessingStatus} setVideoGeneratedStatus={setVideoGeneratedStatus}
          setVideoUrl={setVideoUrl} setVideoId={setVideoId} setVideoGeneratedUrl={setVideoGeneratedUrl} disabledButton={disabledButton} setDisabledButton={setDisabledButton} />
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
            <h3>2. Player Detection (YOLOv8) & Tracker (BotSort)</h3>
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
          <h3>5.Generate Video</h3>
          <img src={videoGenerationIcon} alt="videoGenerationIcon" style={{ width: '50px', height: '50px' }} />
          <BasicSpinner status={videoGeneratedStatus} />
          <hr />
        </div>
      </div>
      <div className='containerVideos'>
        <div>
          <h2>Original Video</h2>
          {videoUrl ? (
            <video width={640} height={480} controls>
              <source src={videoUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            // Add a placeholder image
            <img className='imgEmptyVideo' width={240} src={videoEmptyIcon} alt="Placeholder" />
          )}
        </div>
        <div>
          <h2>Annotated Video</h2>
          {videoGeneratedUrl ? (
            <video width={640} height={480} controls>
              <source src={videoGeneratedUrl} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : <img className='imgEmptyVideo' width={240} src={videoEmptyIcon} alt="Placeholder" />}
        </div>
      </div >
    </>

  );
};

export default App;
