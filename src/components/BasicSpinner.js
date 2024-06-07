import React from 'react';
import Spinner from 'react-bootstrap/Spinner';

// BasicSpinner component that receiver a prop called "upload_status" that has three possible values: "in_progress", "success", "empty"
const BasicSpinner = ({ status }) => {
    if (status === 'in_progress') {
        return (
            <div>
                <Spinner animation="border" variant="primary" role="status" size='md' />
            </div>
        );
    } else if (status === 'success') {
        return (
            <div>
                <p>Done!</p>
            </div>
        );
    } else if (status === 'error') {
        return (
            <div>
                <p>Error</p>
            </div>
        );

    } else {
        return (
            <div>
                <p>Idle</p>
            </div>
        );
    }
}
export default BasicSpinner;