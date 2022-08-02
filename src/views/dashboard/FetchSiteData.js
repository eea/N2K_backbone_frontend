import React, { useState, useEffect } from 'react';
import ConfigData from '../../config.json';
import Highcharts from 'highcharts'
import HighchartsReact from 'highcharts-react-official'

const FetchSiteData = () => {
    const [sitesCountriesData, setSitesCountriesData] = useState([]);
    const [isSitesLoading, setIsSitesLoading] = useState(true);

    useEffect(() => {
        if (isSitesLoading)
            fetch(ConfigData.GET_SITE_COUNT)
                .then(response => response.json())
                .then(data => {
                    setIsSitesLoading(false);
                    setSitesCountriesData(data.Data);
                });
    })
    let seriesData = [];
    let countryList = [];

    let chngPending = [], chngAccepted = [], chngRejected = [];
    let data = sitesCountriesData;
    for (let i in data) {
        //console.log(data)
        chngAccepted.push(data[i].NumAccepted);
        chngPending.push(data[i].NumPending);
        chngRejected.push(data[i].NumRejected);
    }
    seriesData = [
        { name: 'Pending', index: 1, data: chngPending, color: '#033166' },
        { name: 'Accepted', index: 2, data: chngAccepted, color: '#22a4fb' },
        { name: 'Rejected', index: 3, data: chngRejected, color: '#e3f2fd' }
    ];

    countryList = sitesCountriesData.map((e) => e.Country);

    const options = {
        chart: {
            type: 'column'
        },
        credits: {
            enabled: false
        },
        title: {
            text: 'Sites (Pending/Accepted/Rejected)'
        },
        xAxis: {
            categories: countryList
        },
        yAxis: {
            min: 0,
            reversedStacks: false,
            title: {
                text: ''
            }
        },
        plotOptions: {
            series: {
                stacking: 'percent'
            }
        },
        accessibility: {
            enabled: false
        },
        series: seriesData
    }

    return (
        <HighchartsReact
            highcharts={Highcharts}
            options={options}
        />
    );
}

export default FetchSiteData;