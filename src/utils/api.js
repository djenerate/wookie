import axios from 'axios';

const test=false;//log the calls to the console for debugging

export const getApiData = (payload, setApiData, apiData) => {
        let returnPayload = {};

        const fetchData = async () => {
            axios.defaults.withCredentials = true;

            try{
                const result = await axios(
                    payload,
                );

                switch(result.status){
                    case 200:
                        returnPayload = {
                            ...apiData,
                            dataFormatted: false,
                            status: 'ok',
                            data: result.data,
                            loading: false,
                        }
                        break;
                    default:
                        returnPayload = {
                            ...apiData,
                            status: 'fail',
                            loading: false,
                            error: {
                                errorState: true,
                                errorMessage: 'Failed to fetch data'
                            }
                        };
                }
    
                if(test){console.log('payload:', payload)};
                if(test){console.log('returnPayload:', returnPayload)};

                setApiData(returnPayload);
                return returnPayload;
            }
            catch(e){
                if(test){console.log('e:',e)};

                setApiData({
                    ...apiData,
                    status: 'fail',
                    loading: false,
                    error: {
                        errorState: true,
                        errorMessage: e
                    }
                });

                return returnPayload;
            }
        };
        fetchData();
}

export default getApiData;
