import React from 'react';
import Loading from './Loading';
import Error from './Error';

const ApiFeedback = ({apiData}) => {
    if(apiData.error.errorState){
        return(
            <Error errorMessage={apiData.error.errorMessage} />  
        );
    }
    if(apiData.data.length === 0){
        return(
            <h2>No results found</h2>
        );
    }
    if(apiData.loading || !apiData.dataFormatted){
        return(
            <Loading />
        );
    }

    return <></>;
}

export default ApiFeedback;