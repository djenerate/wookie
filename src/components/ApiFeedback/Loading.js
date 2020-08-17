import React from 'react';

const Loading = ()=> {
    return (
        <div className="api api__loading">
            <h3>Loading...</h3>
            <div className="lds-ripple"><div/><div/></div>
        </div>
    )
}

export default Loading;
