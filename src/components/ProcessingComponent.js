import React, { useCallback } from 'react';
import axios from 'axios';
import BasicSpinner from './BasicSpinner';

// ProcessingComponent component that receives a prop called "videoURL" that has the URL of the video to process
// When videoURL changes, the component should make a request to the backend to process the video
function ProcessingComponent({ videoURL, videoId, processingStatus, setProcessingStatus }) {

    // Make a request to the backend to process the video
    const processVideo = useCallback(async () => {
        setProcessingStatus('in_progress');
        try {
            const response = await axios.post('http://localhost:8080/process', {
                params: {
                    videoURL: videoURL,
                    videoId: videoId
                }
            });
            console.log('Video processed successfully:', response.data);
        } catch (error) {
            console.error('Error processing video:', error);
            alert('Error processing video. Please try again.');
            setProcessingStatus('error');
        } finally {
            setProcessingStatus('success');
        }
    }, [videoURL]);

    return (
        <div>
            <h2>Processing Video</h2>
            <BasicSpinner status={processingStatus} />
        </div>
    );
}

export default ProcessingComponent;