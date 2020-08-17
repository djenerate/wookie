import React from 'react';

const Error = ({errorMessage}) => {
    return (
        <div className="api api__error">
            <h3 className="error">Error loading data</h3>
            <p>{String(errorMessage)}</p>
        </div>
    )
}

export default Error;
