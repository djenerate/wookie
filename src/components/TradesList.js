/******************************************************************************************
    Things that still need to be done but were skipped to save time:
        - addItemToFilter - make this nicer
        - add apiData, formatData dependecy to a reducer to stop linter warning: react-hooks/exhaustive-deps
        - abstraction and moving methods to external files
******************************************************************************************/


import React, {useState, useEffect} from 'react';
import ApiFeedback from './ApiFeedback';
import getApiData from '../utils/api';

const apiDataEndpoint = 'http://localhost:3000/trades';

const TradesList = () => {
    //API data - structure for reference and for ease of conversion to TS should it be required
    const [apiData, setApiData] = useState({
        status: '',
        data:  {
                "id": 0,
                "child_trade_set": [
                    {
                    "id": 0,
                    "trade_display_volume": "",
                    "lot_size": "",
                    "price": "",
                    "lot_quantity": 0,
                    "side": "",
                    "start_date": "",
                    "end_date": "",
                    "brokerage_multiplier": 1
                    }
                ],
                "lot_unit_name": "",
                "broker_name": "",
                "trader_name": null,
                "book_name": "",
                "product_name": "",
                "exchange_name": "",
                "source_book_name": null,
                "cancelled": false,
                "matched_trade": null,
                "manual": true,
                "lot_quantity_spread": 0,
                "trade_date": "",
                "exchange_trade_id": null,
                "tas": false,
                "tap": false,
                "rollon_settlement_period": null,
                "screen": false,
                "time_created": "",
                "isin": null,
                "trade_type": "",
                "calendar_period": "",
                "trade_display_volume": "",
                "trade_brokerage_multiplier": 0,
                "matched": false,
                "start_date_spread": null,
                "end_date_spread": null,
                "start_date": "",
                "end_date": "",
                "side": "",
                "spread": false,
                "trade_price": ""
        },
        dataFormatted: false,
        loading: true,
        error: {
            errorState: false,
            errorMessage: ""
        } 
    });

    //filters
    const [productNameFilter, setProductNameFilter] = useState ([]);
    const [productNameFilterSelected, setProductNameFilterSelected] = useState ('Select');

    const [brokerFilter, setBrokerFilter] = useState ([]);
    const [brokerFilterSelected, setBrokerFilterSelected] = useState ('Select');
    
    const [sideFilter, setSideFilter] = useState ([]);
    const [sideFilterSelected, setSideFilterSelected] = useState ('Select');

    const [tradePriceFilter, setTradePriceFilter] = useState ([]);
    const [tradePriceFilterSelected, setTradePriceFilterSelected] = useState ('Select');

    //totals
    const [formattedData, setFormattedData] = useState ([{}]);
    const [tradePriceTotal, setTradePriceTotal] = useState (0);

    useEffect(()=>{
        if(apiData.loading===true) getApiData(apiDataEndpoint, setApiData, apiData);
        if(apiData.data.length > 0) formatData(apiData.data);
    },[productNameFilterSelected, brokerFilterSelected, sideFilterSelected, tradePriceFilterSelected]);

    const formatData = (dataToFormat) => {
        let formattedDataArray=[];
        let totalTradePrices = 0;

        dataToFormat.map((recordData)=>{
            populateFilters(recordData);//populate filters - this could be limited to run once in this senario but if api data is updated with new records this could be an issue down the road

            //check filters against the record data
            if(displayThisRecord(recordData)){
                const tradePrice = parseFloat(recordData.trade_price);

                formattedDataArray.push({
                    book_name: recordData.book_name,
                    cancelled: recordData.cancelled ? 'true' : 'false',
                    end_date: recordData.end_date,
                    matched: recordData.matched ? 'true' : 'false',
                    product_name: recordData.product_name,
                    side: recordData.side,
                    start_date: recordData.start_date,
                    time_created: recordData.time_created,
                    trade_date: recordData.trade_date,
                    trade_display_volume: Math.round(recordData.trade_display_volume),
                    trade_price: formatTradePrice(tradePrice),
                    broker_name: recordData.broker_name
                });

                totalTradePrices+=tradePrice;
            }

            return false;
        });

        setFormattedData(formattedDataArray);
        setTradePriceTotal(totalTradePrices);
        setApiData({
            ...apiData,
            dataFormatted:true
        });
    }

    const renderFormattedDataRows = () => {
        return formattedData.map((dataRecord, key)=>{
            return(
                <tr key={key}>
                    <td>{dataRecord.book_name}</td>
                    <td>{dataRecord.cancelled}</td>
                    <td>{dataRecord.end_date}</td>
                    <td>{dataRecord.matched}</td>
                    <td>{dataRecord.product_name}</td>
                    <td>{dataRecord.side}</td>
                    <td>{dataRecord.start_date}</td>
                    <td>{dataRecord.time_created}</td>
                    <td>{dataRecord.trade_date}</td>
                    <td>{dataRecord.trade_display_volume}</td>
                    <td>{dataRecord.trade_price}</td>
                </tr>
            )
        })
    }

    const formatTradePrice = (rawPrice) => {
        return parseFloat(rawPrice).toFixed(2);
    }

    const displayThisRecord = (recordData) => {
        let displayTheRecord = true;

        if(recordData.product_name !== productNameFilterSelected && productNameFilterSelected!== 'Select') displayTheRecord=false;
        if(recordData.broker_name !== brokerFilterSelected && brokerFilterSelected !== 'Select') displayTheRecord=false;
        if(recordData.side !== sideFilterSelected && sideFilterSelected !== 'Select') displayTheRecord=false;
        if(formatTradePrice(recordData.trade_price) !== tradePriceFilterSelected && tradePriceFilterSelected !== 'Select') displayTheRecord=false;

        return displayTheRecord;
    }

    const handleChange = (setFilterValue, filterValue) => {
        setFilterValue(filterValue);
    }

    const isInArray = (value, arrayToCheck) =>{
        return arrayToCheck.includes(value);
    }

    const addItemToFilter = (whichFilter, setFilterMethod, newItem) => {
        /* todo make this nicer if time permits */
        if(!isInArray(newItem, whichFilter)){
            let newArrayToReturn=whichFilter;
            newArrayToReturn.push(newItem);
            newArrayToReturn.sort();
            setFilterMethod(newArrayToReturn);
        }
    }

    const populateFilters = (dataRecord) => {
        addItemToFilter(productNameFilter, setProductNameFilter, dataRecord.product_name);
        addItemToFilter(brokerFilter, setBrokerFilter, dataRecord.broker_name);
        addItemToFilter(sideFilter, setSideFilter, dataRecord.side);
        addItemToFilter(tradePriceFilter, setTradePriceFilter, formatTradePrice(dataRecord.trade_price));
    }

    const renderFilter = (filterOptions, onChangeMethod, value)=> {
        return (
            <select onChange={(event)=>{handleChange(onChangeMethod,event.target.value)}} value={value}>
                <option>Select</option>
                {
                    filterOptions.map((productName,key)=>{
                        return (<option key={key}>{productName}</option>)
                    })
                }
            </select>
        );
    }

    if(!apiData.loading && !apiData.dataFormatted && !apiData.error.errorState){
        formatData(apiData.data);
    }

    if(apiData.error.errorState || apiData.loading || apiData.data.length === 0){
        return (
            <div className="shadow-container account-overview p-3 p-lg-3">
                <ApiFeedback apiData={apiData} />
            </div>
        );
    } 
    return (
        <div>
            <h1>Trades</h1>

            <div>
                <strong>Filters:</strong><br/>
                Product Name: {renderFilter(productNameFilter, setProductNameFilterSelected, productNameFilterSelected)} <br/>
                Broker Name: {renderFilter(brokerFilter, setBrokerFilterSelected, brokerFilterSelected)} <br/>
                Side: {renderFilter(sideFilter, setSideFilterSelected)} <br/>
                Trade Price: {renderFilter(tradePriceFilter, setTradePriceFilterSelected)} <br/>
            </div>

            <br/>

            <div>
                <strong>Total of trade prices: </strong>{tradePriceTotal.toFixed(3)}<br/>
                <strong>Average trade price: </strong>{(tradePriceTotal/formattedData.length).toFixed(3) === 'NaN' ? 0 : (tradePriceTotal/formattedData.length).toFixed(3) }
            </div>

            <br/>

            <table>
                <thead>
                    <tr>
                        <th>book_name</th>
                        <th>cancelled</th>
                        <th>end_date</th>
                        <th>matched</th>
                        <th>product_name</th>
                        <th>side</th>
                        <th>start_date</th>
                        <th>time_created</th>
                        <th>trade_date</th>
                        <th>trade_display_volume</th>
                        <th>trade_price</th>
                    </tr>
                </thead>
                <tbody>
                    {formattedData.length > 0 ? renderFormattedDataRows() : <tr><td colSpan="11">No records found</td></tr>}
                </tbody>
            </table>

        </div>
    );

}

export default TradesList;
