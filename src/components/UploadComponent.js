import React, { useState } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';

function UploadComponent({ setUploadStatus, setVideoUrl, setVideoId }) {
    const [selectedFile, setSelectedFile] = useState(null);


    const handleFileChange = (event) => {
        setSelectedFile(event.target.files[0]);
    };

    const handleUpload = async () => {
        if (!selectedFile) {
            alert('Please select a file to upload.');
            return;
        }

        const formData = new FormData();

        // Verify is an mp4 file
        if (selectedFile.type !== 'video/mp4') {
            alert('Please select a mp4 file to upload.');
            return;
        }

        const videoId_temp = uuidv4();
        setVideoId(videoId_temp);

        formData.append('file', selectedFile);

        setUploadStatus("in_progress");

        try {
            const response = await axios.post('http://localhost:8080/upload', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',

                },
                params: {
                    videoId: videoId_temp
                }
            });
            const videoUrl_temp = response.data; // Assuming the URL is directly returned in the response data
            console.log('Uploaded video URL:', videoUrl_temp);
            setVideoUrl(response.data);
        } catch (error) {
            console.error('Error uploading file:', error);
            setUploadStatus("error");
            alert('Error uploading file. Please try again.');
        } finally {
            setUploadStatus("success");
        }
    };

    return (
        <div>
            <input type="file" onChange={handleFileChange} />
            {(
                <button onClick={handleUpload}>Upload</button>
            )}
        </div>
    );
}

export default UploadComponent;
